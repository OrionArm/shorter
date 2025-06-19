import {
  restore,
  createEffect,
  createEvent,
  sample,
  createStore,
} from "effector";
import { chainRoute, redirect } from "atomic-router";
import {
  createLink,
  deleteLink,
  getUrlInfoLink,
  type CreateLinkParams,
  type LinkResponse,
} from "@/features/shorten/api";
import { appRoutes } from "@/shared/routes";

const errorToString = (error: unknown) =>
  error instanceof Error ? error.message : "Unknown error";

export const deleteLinkEv = createEvent();
export const openCreateNewLinkEv = createEvent();

export const createLinkFx = createEffect<CreateLinkParams, LinkResponse>(
  createLink
);
export const getLinkFx = createEffect<string, LinkResponse>(getUrlInfoLink);
export const deleteLinkFx = createEffect<string, void>(deleteLink);

export const $isLoading = getLinkFx.pending;
export const $linkData = restore(getLinkFx, null)
  .on(createLinkFx.doneData, (_, payload) => payload)
  .reset(openCreateNewLinkEv);

export const $linkDataError = createStore<string | null>(null)
  .on(getLinkFx.failData, (_, error) => errorToString(error))
  .on(createLinkFx.failData, (_, error) => errorToString(error))
  .reset(createLinkFx);

export const manageLinkLoadedRoute = chainRoute({
  route: appRoutes.manageLink,
  beforeOpen: {
    effect: getLinkFx,
    mapParams: ({ params }) => params.slug,
  },
});

sample({
  clock: deleteLinkEv,
  source: $linkData,
  target: deleteLinkFx,
  fn: (data: LinkResponse) => data.alias,
  filter: (data) => data !== null,
});

redirect({
  clock: deleteLinkFx.finally,
  route: appRoutes.createLink,
});

redirect({
  clock: openCreateNewLinkEv,
  route: appRoutes.createLink,
});

sample({
  clock: createLinkFx.doneData,
  fn: ({ alias }) => ({ slug: alias }),
  target: appRoutes.manageLink.open,
});
