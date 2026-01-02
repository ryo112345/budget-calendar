import { useCallback, useState } from "react";
import { useNavigate, useRevalidator } from "react-router";
import { customFetch } from "~/shared/lib/fetch";
import { NAVIGATION_PAGE_LIST } from "~/app/routes";
import { useAuth } from "./useAuth";

export function useSignOut() {
  const navigate = useNavigate();
  const revalidator = useRevalidator();
  const { csrfToken } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const signOut = useCallback(async () => {
    setIsLoading(true);
    try {
      // Call signOut API to clear HttpOnly cookie on server
      await customFetch("/users/signOut", {
        method: "POST",
        headers: {
          "X-CSRF-Token": csrfToken,
        },
      });
    } catch {
      // Even if API fails, proceed with client-side cleanup
    } finally {
      setIsLoading(false);
    }

    // loaderを再実行して認証状態を更新
    revalidator.revalidate();

    // Redirect to sign-in page
    navigate(NAVIGATION_PAGE_LIST.signInPage, { replace: true });
  }, [navigate, revalidator, csrfToken]);

  return { signOut, isLoading };
}
