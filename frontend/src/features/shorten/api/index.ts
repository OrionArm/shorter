import { apiRequest } from "@/shared/lib";

export type CreateLinkParams = {
  url: string;
  alias?: string;
  expiresAt?: string;
};

export type LinkResponse = {
  id: string;
  url: string;
  alias: string;
  expiresAt: string | null;
  createdAt: string;
};

export const createLink = async (
  params: CreateLinkParams
): Promise<LinkResponse> => {
  const options = {
    method: "POST",
    json: {
      url: params.url,
      alias: params.alias,
      expiresAt: params.expiresAt,
    },
  };
  return apiRequest<LinkResponse>("shorten", options);
};
export const deleteLink = async (alias: string): Promise<void> =>
  apiRequest<void>(`delete/${alias}`, {
    method: "DELETE",
  });

export const getUrlInfoLink = async (alias: string): Promise<LinkResponse> => {
  return apiRequest<LinkResponse>(`info/${alias}`);
};

export type AnalyticsResponse = {
  recentIps: string[];
  totalClicks: number;
};
export const getUrlAnalytics = async (
  alias: string
): Promise<AnalyticsResponse> => {
  return apiRequest<AnalyticsResponse>(`analytics/${alias}`);
};
