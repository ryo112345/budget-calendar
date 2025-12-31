import { useRouteLoaderData } from "react-router";

export type AuthContext = {
  isSignedIn: boolean;
  csrfToken: string;
};

export function useAuth(): AuthContext {
  const data = useRouteLoaderData("root") as AuthContext | undefined;

  return {
    isSignedIn: data?.isSignedIn ?? false,
    csrfToken: data?.csrfToken ?? "",
  };
}
