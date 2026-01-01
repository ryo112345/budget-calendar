import { getAuthCache, invalidateAuthCache } from "~/features/auth/services/cache";
import { ApiError, type ErrorResponseData } from "./errors";

const getUrl = (contextUrl: string): string => {
  const baseUrl = import.meta.env.VITE_API_ENDPOINT_URI;

  if (!baseUrl) {
    throw new Error("VITE_API_ENDPOINT_URI is not defined");
  }

  const requestUrl = new URL(contextUrl, baseUrl);
  return requestUrl.toString();
};

export const customFetch = async <T>(url: string, options: RequestInit): Promise<T> => {
  const requestUrl = getUrl(url);
  const requestHeaders = new Headers(options.headers);
  const authCache = getAuthCache();

  if (authCache?.csrfToken && !requestHeaders.has("X-CSRF-Token")) {
    requestHeaders.set("X-CSRF-Token", authCache.csrfToken);
  }

  let body = options.body;

  if (typeof body === "string" && requestHeaders.get("Content-Type")?.includes("application/json")) {
    body = body.replace(/"\d{4}-\d{2}-\d{2}T[^"]+"/g, (match) => `"${match.slice(1, 11)}"`);
  }

  const requestInit: RequestInit = {
    ...options,
    headers: requestHeaders,
    credentials: "include",
    body,
  };

  const response = await fetch(requestUrl, requestInit);

  if (response.status === 401) {
    invalidateAuthCache();
  }

  const data = await response.json();

  // エラーレスポンスの場合はApiErrorを投げる
  if (!response.ok) {
    throw new ApiError(response.status, data as ErrorResponseData);
  }

  return data as T;
};
