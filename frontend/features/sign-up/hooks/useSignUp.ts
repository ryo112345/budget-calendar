import { useCallback, useState } from "react";
import { useNavigate } from "react-router";
import type { UserSignUpInput } from "~/apis/model";
import { NAVIGATION_PAGE_LIST } from "~/app/routes";
import { usePostSignUp } from "~/services/users";

export const useSignUp = (csrfToken: string) => {
  const [userSignUpInputs, setUserSignUpInputs] = useState<UserSignUpInput>({
    name: "",
    email: "",
    password: "",
  });

  const updateSignUpInput = useCallback((params: Partial<UserSignUpInput>) => {
    setUserSignUpInputs((prev: UserSignUpInput) => ({ ...prev, ...params }));
  }, []);

  const [errorMessage, setErrorMessage] = useState<string>("");

  const setSignUpTextInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      updateSignUpInput({ [e.target.name]: e.target.value });
    },
    [updateSignUpInput],
  );

  const navigate = useNavigate();

  const initErrorMessage = useCallback(() => {
    setErrorMessage("");
  }, []);

  const onSuccessPostSignUp = useCallback(
    (result: { success: boolean; error?: string }) => {
      if (result.success) {
        window.alert("会員登録が完了しました");
        navigate(NAVIGATION_PAGE_LIST.signInPage);
        return;
      }

      setErrorMessage(result.error ?? "エラーが発生しました");
      updateSignUpInput({ password: "" });
    },
    [navigate, updateSignUpInput],
  );

  const { mutate } = usePostSignUp(initErrorMessage, onSuccessPostSignUp, userSignUpInputs, csrfToken);

  return {
    userSignUpInputs,
    setSignUpTextInput,
    errorMessage,
    mutate,
  };
};
