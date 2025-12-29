import { getCsrf } from "~/apis/csrf/csrf";
import { getErrorMessage } from "../base/errors";

export async function getCsrfToken() {
  let res;
  try {
    res = await getCsrf();
  } catch {
    throw new Error(getErrorMessage("CONNECTION_ERROR"));
  }

  if (res.status === 500) {
    throw new Error(getErrorMessage(res.data.error.details?.[0]?.reason));
  }

  return res.data.csrfToken;
}
