import { useCallback, useState } from "react";
import { useNavigate } from "react-router";
import type { UserSignUpInput } from "~/apis/model";
import { usePostUsersSignUp } from "~/apis/users/users";
import { NAVIGATION_PAGE_LIST } from "~/app/routes";
import { handleMutationError, handleNetworkError } from "~/shared/lib/mutation-handlers";

type FieldErrors = {
  name?: string;
  email?: string;
  password?: string;
};

export const useSignUp = () => {
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
      setFieldErrors((prev) => ({ ...prev, [e.target.name]: undefined }));
    },
    [updateSignUpInput],
  );

  const navigate = useNavigate();

  const { mutate } = usePostUsersSignUp({
    mutation: {
      onSuccess: (res) => {
        if (res.status === 200) {
          window.alert("会員登録が完了しました");
          navigate(NAVIGATION_PAGE_LIST.signInPage);
          return;
        }

        handleMutationError(res, {
          setErrorMessage,
          setFieldErrors,
          extractFieldErrors: (metadata) => ({
            name: metadata.name,
            email: metadata.email,
            password: metadata.password,
          }),
          clearPassword: () => updateSignUpInput({ password: "" }),
        });
      },
      onError: () => handleNetworkError(setErrorMessage),
    },
  });

  const handleSubmit = useCallback(() => {
    mutate({ data: userSignUpInputs });
  }, [mutate, userSignUpInputs]);

  return {
    userSignUpInputs,
    setSignUpTextInput,
    errorMessage,
    fieldErrors,
    mutate: handleSubmit,
  };
};
