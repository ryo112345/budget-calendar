import { useMutation } from "@tanstack/react-query";
import { postUserSignIn, postUserSignUp, type SignUpResult, type SignInResult } from "./api";
import type { UserSignInInput, UserSignUpInput } from "~/apis/model";

export const usePostSignUp = (onMutate: () => void, onSuccess: (data: SignUpResult) => void, input: UserSignUpInput, csrfToken: string) => {
  return useMutation({
    onMutate: () => onMutate,
    mutationFn: () => postUserSignUp(input, csrfToken),
    onSuccess: (data) => {
      onSuccess(data);
    },
  });
};

export const usePostSignIn = (onMutate: () => void, onSuccess: (data: SignInResult) => void, input: UserSignInInput, csrfToken: string) => {
  return useMutation({
    onMutate: () => onMutate,
    mutationFn: () => postUserSignIn(input, csrfToken),
    onSuccess: (data) => {
      onSuccess(data);
    },
  });
};
