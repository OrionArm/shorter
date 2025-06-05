import { createHistoryRouter } from "atomic-router";
import { createBrowserHistory } from "history";
import { CreateLinkPage, ManageLinkPage } from "@/pages";
import { notFoundRoute } from "./common_routes";
import { createRoutesView } from "atomic-router-react";
import { NotFoundPage } from "@/pages/not_found";
import { appRoutes } from "@/shared/routes";

const routes = [
  { path: "/", route: appRoutes.createLink, view: CreateLinkPage },
  { path: "/:slug", route: appRoutes.manageLink, view: ManageLinkPage },
];

export const router = createHistoryRouter({
  routes,
  notFoundRoute,
});

const history = createBrowserHistory();
router.setHistory(history);

export const Routing = createRoutesView({
  routes,
  otherwise: NotFoundPage,
});
