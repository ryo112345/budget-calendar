import { getErrorMessage } from "./errors";

type ErrorResponse = {
  error: {
    details?: Array<{
      reason?: string;
      metadata?: Record<string, string>;
    }>;
  };
};

type ApiResponse = {
  status: number;
  data: ErrorResponse;
};

type MutationHandlers<TFieldErrors> = {
  setErrorMessage: (message: string) => void;
  setFieldErrors: (errors: TFieldErrors) => void;
  extractFieldErrors: (metadata: Record<string, string>) => TFieldErrors;
  onSuccess?: () => void;
  clearPassword?: () => void;
};

export function handleMutationError<TFieldErrors>(res: ApiResponse, handlers: MutationHandlers<TFieldErrors>): void {
  const { setErrorMessage, setFieldErrors, extractFieldErrors, clearPassword } = handlers;

  const details = res.data.error?.details?.[0];
  const metadata = details?.metadata;
  const reason = details?.reason;

  if (res.status === 400) {
    if (metadata) {
      setFieldErrors(extractFieldErrors(metadata));
    } else {
      setErrorMessage(getErrorMessage(reason));
    }
  }

  if (res.status === 401 || res.status === 409 || res.status === 500) {
    setErrorMessage(getErrorMessage(reason));
  }

  clearPassword?.();
}

export function handleNetworkError(setErrorMessage: (message: string) => void): void {
  setErrorMessage(getErrorMessage("CONNECTION_ERROR"));
}
