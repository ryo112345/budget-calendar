import { getCsrf } from "~/apis/csrf/csrf";
import { getErrorMessage, isApiError } from "~/shared/lib/errors";

export async function getCsrfToken() {
  try {
    const res = await getCsrf();
    return res.csrfToken;
  } catch (error) {
    if (isApiError(error)) {
      throw new Error(getErrorMessage(error.reason));
    }
    throw new Error(getErrorMessage("CONNECTION_ERROR"));
  }
}
