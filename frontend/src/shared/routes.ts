import { createRoute } from "atomic-router";

export const appRoutes = {
  createLink: createRoute(),
  manageLink: createRoute<{ slug: string }>(),
};
