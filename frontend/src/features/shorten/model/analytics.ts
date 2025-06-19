import { createEffect, createEvent, restore, sample } from "effector";
import {
  getUrlAnalytics,
  type AnalyticsResponse,
  type LinkResponse,
} from "../api";
import { $linkData } from "./link_store";
import { openCreateNewLinkEv } from "./link_store";

export const getLinkAnalyticsEv = createEvent();
export const getLinkAnalyticsFx = createEffect<string, AnalyticsResponse>(
  getUrlAnalytics
);

sample({
  clock: getLinkAnalyticsEv,
  source: $linkData,
  target: getLinkAnalyticsFx,
  fn: (data: LinkResponse) => data.alias,
  filter: (data) => data !== null,
});

export const $analyticsData = restore(getLinkAnalyticsFx.doneData, null);
$analyticsData.on(openCreateNewLinkEv, () => null);
