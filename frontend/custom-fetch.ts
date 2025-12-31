import { invalidateAuthCache } from "~/services/auth/cache";

const getUrl = (contextUrl: string): string => {
  const baseUrl = process.env.VITE_API_ENDPOINT_URI;

  if (!baseUrl) {
    throw new Error("VITE_API_ENDPOINT_URI is not defined");
  }

  const requestUrl = new URL(contextUrl, baseUrl);
  return requestUrl.toString();
};

const getResponseBody = <T>(response: Response): Promise<T> => {
  return response.json();
};

export const customFetch = async <T>(url: string, options: RequestInit): Promise<T> => {
  const requestUrl = getUrl(url);

  const requestHeaders = new Headers(options.headers);

  let body = options.body;

  if (typeof body === "string" && requestHeaders.get("Content-Type")?.includes("application/json")) {
    body = body.replace(/"\d{4}-\d{2}-\d{2}T[^"]+"/g, (match) => `"${match.slice(1, 11)}"`);
  }

  const requestInit: RequestInit = {
    ...options,
    headers: options.headers,
    credentials: "include",
    body,
  };

  const response = await fetch(requestUrl, requestInit);

  if (response.status === 401) {
    invalidateAuthCache();
  }

  const data = await getResponseBody<T>(response);

  return { status: response.status, data, headers: response.headers } as T;
};
