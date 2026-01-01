import { useCallback, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import type { UserSignInInput } from "~/apis/model";
import { usePostUsersSignIn } from "~/apis/users/users";
import { NAVIGATION_PAGE_LIST } from "~/app/routes";
import { invalidateAuthCache } from "../services/cache";
import { handleMutationError } from "~/shared/lib/mutation-handlers";

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
      onSuccess: () => {
        invalidateAuthCache();
        toast.success("ログインしました");
        navigate(NAVIGATION_PAGE_LIST.calendarPage);
      },
      onError: (error) => {
        handleMutationError(error, {
          setErrorMessage,
          setFieldErrors,
          extractFieldErrors: (metadata) => ({
            email: metadata.email,
            password: metadata.password,
          }),
          clearPassword: () => updateSignInInput({ password: "" }),
        });
      },
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
