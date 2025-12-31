import { useCallback, useState } from "react";
import { useNavigate } from "react-router";
import type { UserSignInInput } from "~/apis/model";
import { usePostUsersSignIn } from "~/apis/users/users";
import { NAVIGATION_PAGE_LIST } from "~/app/routes";
import { invalidateAuthCache } from "~/services/auth/cache";
import { handleMutationError, handleNetworkError } from "~/services/base/mutation-handlers";

type SignInFieldErrors = {
  email?: string;
  password?: string;
};

export const useSignIn = () => {
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
      setFieldErrors((prev) => ({ ...prev, [e.target.name]: undefined }));
    },
    [updateSignInInput],
  );

  const navigate = useNavigate();

  const { mutate } = usePostUsersSignIn({
    mutation: {
      onMutate: () => {
        setErrorMessage("");
        setFieldErrors({});
      },
      onSuccess: (res) => {
        if (res.status === 200) {
          invalidateAuthCache();
          window.alert("ログインしました");
          navigate(NAVIGATION_PAGE_LIST.calendarPage);
          return;
        }

        handleMutationError(res, {
          setErrorMessage,
          setFieldErrors,
          extractFieldErrors: (metadata) => ({
            email: metadata.email,
            password: metadata.password,
          }),
          clearPassword: () => updateSignInInput({ password: "" }),
        });
      },
      onError: () => handleNetworkError(setErrorMessage),
    },
  });

  const handleSubmit = useCallback(() => {
    mutate({ data: userSignInInputs });
  }, [mutate, userSignInInputs]);

  return {
    userSignInInputs,
    setSignInTextInput,
    errorMessage,
    fieldErrors,
    mutate: handleSubmit,
  };
};
