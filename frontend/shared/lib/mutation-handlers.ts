import { getErrorMessage, isApiError } from "./errors";

type MutationHandlers<TFieldErrors> = {
  setErrorMessage: (message: string) => void;
  setFieldErrors: (errors: TFieldErrors) => void;
  extractFieldErrors: (metadata: Record<string, string>) => TFieldErrors;
  clearPassword?: () => void;
};

export function handleMutationError<TFieldErrors>(error: unknown, handlers: MutationHandlers<TFieldErrors>): void {
  const { setErrorMessage, setFieldErrors, extractFieldErrors, clearPassword } = handlers;

  // ネットワークエラーなど
  if (!isApiError(error)) {
    setErrorMessage(getErrorMessage("CONNECTION_ERROR"));
    clearPassword?.();
    return;
  }

  const { status, metadata, reason } = error;

  if (status === 400) {
    if (metadata) {
      setFieldErrors(extractFieldErrors(metadata));
    } else {
      setErrorMessage(getErrorMessage(reason));
    }
  }

  if (status === 401 || status === 409 || status === 500) {
    setErrorMessage(getErrorMessage(reason));
  }

  clearPassword?.();
}
