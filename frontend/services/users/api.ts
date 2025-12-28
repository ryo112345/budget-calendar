import type { UserSignInInput, UserSignUpInput } from "~/apis/model";
import { getRequestHeaders } from "../base/api";
import { getUsersCheckSignedIn, postUsersSignIn, postUsersSignUp } from "~/apis/users/users";

export async function postUserSignUp(input: UserSignUpInput, csrfToken: string): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await postUsersSignUp(input, getRequestHeaders(csrfToken));

    switch (res.status) {
      case 200:
        return { success: true };
      case 400:
        return { success: false, error: "入力内容に誤りがあります" };
      case 409:
        return { success: false, error: "このメールアドレスは既に登録されています" };
      case 500:
        throw new Error(`Internal Server Error: ${res.data}`);
    }
  } catch (error) {
    throw new Error(`Unexpected error: ${error}`);
  }
}

export async function postUserSignIn(input: UserSignInInput, csrfToken: string): Promise<string> {
  try {
    const res = await postUsersSignIn(input, getRequestHeaders(csrfToken));

    switch (res.status) {
      case 200:
        return "";
      case 400:
        return "入力内容に誤りがあります";
      case 401:
        return "メールアドレスまたはパスワードが正しくありません";
      case 500:
        throw new Error(`Internal Server Error: ${res.data}`);
    }
  } catch (error) {
    throw new Error(`Unexpected error: ${error}`);
  }
}

export async function getCheckSignedIn(csrfToken: string): Promise<boolean> {
  try {
    const res = await getUsersCheckSignedIn(getRequestHeaders(csrfToken));

    return res.data.isSignedIn;
  } catch (error) {
    throw new Error(`Unexpected error: ${error}`);
  }
}
