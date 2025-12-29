import { useCallback, useState } from "react";
import { useNavigate } from "react-router";
import type { UserSignUpInput } from "~/apis/model";
import { NAVIGATION_PAGE_LIST } from "~/app/routes";
import { usePostSignUp } from "~/services/users";
import type { FieldErrors, SignUpResult } from "~/services/users/api";

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
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const setSignUpTextInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      updateSignUpInput({ [e.target.name]: e.target.value });
      // 入力時にそのフィールドのエラーをクリア
      setFieldErrors((prev) => ({ ...prev, [e.target.name]: undefined }));
    },
    [updateSignUpInput],
  );

  const navigate = useNavigate();

  const initErrors = useCallback(() => {
    setErrorMessage("");
    setFieldErrors({});
  }, []);

  const onSuccessPostSignUp = useCallback(
    (result: SignUpResult) => {
      if (result.success) {
        window.alert("会員登録が完了しました");
        navigate(NAVIGATION_PAGE_LIST.signInPage);
        return;
      }

      if (result.fieldErrors) {
        setFieldErrors(result.fieldErrors);
      }

      if (result.error) {
        setErrorMessage(result.error);
      }

      updateSignUpInput({ password: "" });
    },
    [navigate, updateSignUpInput],
  );

  const { mutate } = usePostSignUp(initErrors, onSuccessPostSignUp, userSignUpInputs, csrfToken);

  return {
    userSignUpInputs,
    setSignUpTextInput,
    errorMessage,
    fieldErrors,
    mutate,
  };
};
