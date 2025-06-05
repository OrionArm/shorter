import { appRoutes } from "@/shared/routes";
import { redirect } from "atomic-router";
import { createEvent } from "effector";

export const createNewLinkEv = createEvent();

redirect({
  clock: createNewLinkEv,
  route: appRoutes.createLink,
});
