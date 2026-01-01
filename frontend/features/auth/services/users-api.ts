import { getRequestHeaders } from "~/shared/lib/api";
import { getErrorMessage, isApiError } from "~/shared/lib/errors";
import { getUsersCheckSignedIn } from "~/apis/users/users";

export async function getCheckSignedIn(csrfToken: string): Promise<boolean> {
  try {
    const res = await getUsersCheckSignedIn(getRequestHeaders(csrfToken));
    return res.is_signed_in;
  } catch (error) {
    // 401は未認証 = ログインしていない（エラーではない）
    if (isApiError(error) && error.status === 401) {
      return false;
    }
    // その他のエラー
    if (isApiError(error)) {
      throw new Error(getErrorMessage(error.reason));
    }
    throw new Error(getErrorMessage("CONNECTION_ERROR"));
  }
}
