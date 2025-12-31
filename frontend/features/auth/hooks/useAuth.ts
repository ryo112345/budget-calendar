import { useRouteLoaderData } from "react-router";
import type { AuthContext } from "../auth-context";

export function useAuth(): AuthContext {
  const data = useRouteLoaderData("root") as AuthContext | undefined;

  return {
    isSignedIn: data?.isSignedIn ?? false,
    csrfToken: data?.csrfToken ?? "",
  };
}
