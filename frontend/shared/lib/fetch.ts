import { ApiError, type ErrorResponseData } from "./errors";
import { getCsrfToken } from "./csrf-store";

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

  // CSRFトークンをヘッダーに追加
  const csrfToken = getCsrfToken();
  if (csrfToken && !requestHeaders.has("X-CSRF-Token")) {
    requestHeaders.set("X-CSRF-Token", csrfToken);
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

  // 204 No Contentの場合はボディがないのでそのまま返す
  if (response.status === 204) {
    return undefined as T;
  }

  const data = await response.json();

  // エラーレスポンスの場合はApiErrorを投げる
  if (!response.ok) {
    throw new ApiError(response.status, data as ErrorResponseData);
  }

  return data as T;
};
