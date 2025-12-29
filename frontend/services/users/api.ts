import type { UserSignInInput, UserSignUpInput } from "~/apis/model";
import { getRequestHeaders } from "../base/api";
import { getErrorMessage } from "../base/errors";
import { getUsersCheckSignedIn, postUsersSignIn, postUsersSignUp } from "~/apis/users/users";

export type FieldErrors = {
  name?: string;
  email?: string;
  password?: string;
};

export type SignUpResult = {
  success: boolean;
  error?: string;
  fieldErrors?: FieldErrors;
};

export async function postUserSignUp(input: UserSignUpInput, csrfToken: string): Promise<SignUpResult> {
  try {
    const res = await postUsersSignUp(input, getRequestHeaders(csrfToken));

    switch (res.status) {
      case 200:
        return { success: true };
      case 400: {
        const details = res.data.error.details?.[0];
        const metadata = details?.metadata;
        if (metadata) {
          return {
            success: false,
            fieldErrors: {
              name: metadata.name,
              email: metadata.email,
              password: metadata.password,
            },
          };
        }
        return { success: false, error: getErrorMessage(details?.reason) };
      }
      case 409:
        return { success: false, error: getErrorMessage(res.data.error.details?.[0]?.reason) };
      case 500:
        throw new Error(getErrorMessage(res.data.error.details?.[0]?.reason));
    }
  } catch {
    throw new Error(getErrorMessage("CONNECTION_ERROR"));
  }
}

export type SignInFieldErrors = {
  email?: string;
  password?: string;
};

export type SignInResult = {
  success: boolean;
  error?: string;
  fieldErrors?: SignInFieldErrors;
};

export async function postUserSignIn(input: UserSignInInput, csrfToken: string): Promise<SignInResult> {
  try {
    const res = await postUsersSignIn(input, getRequestHeaders(csrfToken));

    switch (res.status) {
      case 200:
        return { success: true };
      case 400: {
        const details = res.data.error.details?.[0];
        const metadata = details?.metadata;
        if (metadata) {
          return {
            success: false,
            fieldErrors: {
              email: metadata.email,
              password: metadata.password,
            },
          };
        }
        return { success: false, error: getErrorMessage(details?.reason) };
      }
      case 401:
        return { success: false, error: getErrorMessage(res.data.error.details?.[0]?.reason) };
      case 500:
        throw new Error(getErrorMessage(res.data.error.details?.[0]?.reason));
    }
  } catch {
    throw new Error(getErrorMessage("CONNECTION_ERROR"));
  }
}

export async function getCheckSignedIn(csrfToken: string): Promise<boolean> {
  try {
    const res = await getUsersCheckSignedIn(getRequestHeaders(csrfToken));

    return res.data.is_signed_in;
  } catch {
    throw new Error(getErrorMessage("CONNECTION_ERROR"));
  }
}
