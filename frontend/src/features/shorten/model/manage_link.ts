import { restore, createEffect, createEvent, sample } from "effector";
import { chainRoute, redirect } from "atomic-router";
import {
  deleteLink,
  getUrlInfoLink,
  type LinkResponse,
} from "@/features/shorten/api";
import { createNewLinkEv } from "./create_link";
import { appRoutes } from "@/shared/routes";

export const getLinkDataFx = createEffect<string, LinkResponse>(getUrlInfoLink);
export const $linkData = restore(getLinkDataFx, null);
export const $error = restore(getLinkDataFx.failData, null);
$linkData.on(createNewLinkEv, () => null);
export const $isLoading = getLinkDataFx.pending;

export const manageLinkLoadedRoute = chainRoute({
  route: appRoutes.manageLink,
  beforeOpen: {
    effect: getLinkDataFx,
    mapParams: ({ params }) => params.slug,
  },
});

export const deleteLinkDataEv = createEvent();
export const deleteLinkDataFx = createEffect<string, void>(deleteLink);

sample({
  clock: deleteLinkDataEv,
  source: $linkData,
  target: deleteLinkDataFx,
  fn: (data: LinkResponse) => data.alias,
  filter: (data) => data !== null,
});

redirect({
  clock: deleteLinkDataFx.finally,
  route: appRoutes.createLink,
});
