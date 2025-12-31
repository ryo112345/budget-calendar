import { useRouteLoaderData } from "react-router";
import type { AuthState } from "../auth-context";

export function useAuth(): AuthState {
  const data = useRouteLoaderData("root") as AuthState | undefined;

  return {
    isSignedIn: data?.isSignedIn ?? false,
    csrfToken: data?.csrfToken ?? "",
  };
}
