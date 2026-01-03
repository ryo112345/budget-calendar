import { useCallback, useState } from "react";
import { useNavigate, useRevalidator } from "react-router";
import { toast } from "sonner";
import type { UserSignUpInput } from "~/apis/model";
import { usePostUsersSignUp } from "~/apis/users/users";
import { NAVIGATION_PAGE_LIST } from "~/app/routes";
import { handleMutationError } from "~/shared/lib/mutation-handlers";

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
  const revalidator = useRevalidator();

  const { mutate } = usePostUsersSignUp({
    mutation: {
      onSuccess: () => {
        // loaderを再実行して認証状態を更新
        revalidator.revalidate();
        toast.success("会員登録が完了しました");
        navigate(NAVIGATION_PAGE_LIST.calendarPage);
      },
      onError: (error) => {
        handleMutationError(error, {
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
