import { createRouteView } from "atomic-router-react";
import { ManageLinkView } from "@/features/shorten";
import { manageLinkLoadedRoute } from "@/features/shorten/model/link_store";
import { NotFoundPage } from "../not_found";

export const ManageLinkPage = createRouteView<{ slug: string }, object, object>(
  {
    route: manageLinkLoadedRoute,
    view: ManageLinkView,
    otherwise: NotFoundPage,
  }
);
