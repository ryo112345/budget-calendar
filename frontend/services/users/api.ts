import { getRequestHeaders } from "../base/api";
import { getErrorMessage } from "../base/errors";
import { getUsersCheckSignedIn } from "~/apis/users/users";

export async function getCheckSignedIn(csrfToken: string): Promise<boolean> {
  try {
    const res = await getUsersCheckSignedIn(getRequestHeaders(csrfToken));

    return res.data.is_signed_in;
  } catch {
    throw new Error(getErrorMessage("CONNECTION_ERROR"));
  }
}
