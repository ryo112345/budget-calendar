import { useCallback, useState } from "react";
import { useNavigate } from "react-router";
import type { UserSignInInput } from "~/apis/model";
import { NAVIGATION_PAGE_LIST } from "~/app/routes";
import { usePostSignIn } from "~/services/users";
import type { SignInFieldErrors, SignInResult } from "~/services/users/api";

export const useSignIn = (csrfToken: string) => {
  const [userSignInInputs, setUserSignInInputs] = useState<UserSignInInput>({
    email: "",
    password: "",
  });

  const updateSignInInput = useCallback((params: Partial<UserSignInInput>) => {
    setUserSignInInputs((prev: UserSignInInput) => ({ ...prev, ...params }));
  }, []);

  const [errorMessage, setErrorMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState<SignInFieldErrors>({});

  const setSignInTextInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      updateSignInInput({ [e.target.name]: e.target.value });
      // 入力時にそのフィールドのエラーをクリア
      setFieldErrors((prev) => ({ ...prev, [e.target.name]: undefined }));
    },
    [updateSignInInput],
  );

  const navigate = useNavigate();

  const initErrors = useCallback(() => {
    setErrorMessage("");
    setFieldErrors({});
  }, []);

  const onSuccessPostSignIn = useCallback(
    (result: SignInResult) => {
      if (result.success) {
        window.alert("ログインしました");
        navigate(NAVIGATION_PAGE_LIST.calendarPage);
        return;
      }

      if (result.fieldErrors) {
        setFieldErrors(result.fieldErrors);
      }

      if (result.error) {
        setErrorMessage(result.error);
      }

      updateSignInInput({ password: "" });
    },
    [navigate, updateSignInInput],
  );

  const { mutate } = usePostSignIn(initErrors, onSuccessPostSignIn, userSignInInputs, csrfToken);

  return {
    userSignInInputs,
    setSignInTextInput,
    errorMessage,
    fieldErrors,
    mutate,
  };
};
