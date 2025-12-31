import { redirect, type MiddlewareFunction } from "react-router";
import { authContext } from "./auth-context";
import { getRouteDefinition, NAVIGATION_PAGE_LIST } from "~/app/routes";
import { getCheckSignedIn } from "~/services/users/api";
import { getCsrfToken } from "~/services/csrf/api";
import { getAuthCache, setAuthCache } from "~/services/auth/cache";

async function getAuthState(): Promise<{ csrfToken: string; isSignedIn: boolean }> {
  const cached = getAuthCache();
  if (cached) {
    return { csrfToken: cached.csrfToken, isSignedIn: cached.isSignedIn };
  }

  const csrfToken = await getCsrfToken();
  const isSignedIn = await getCheckSignedIn(csrfToken);
  setAuthCache(csrfToken, isSignedIn);

  return { csrfToken, isSignedIn };
}

export const authMiddleware: MiddlewareFunction = async ({ request, context }) => {
  const { csrfToken, isSignedIn } = await getAuthState();

  const url = new URL(request.url);
  const pathname = url.pathname;
  const routeDef = getRouteDefinition(pathname);

  let redirectTo: string | null = null;

  if (routeDef) {
    // ログイン済みユーザーがアクセスすべきでないページ（ログインページ等）→ リダイレクト
    if (routeDef.redirectIfAuthenticated && isSignedIn) {
      redirectTo = NAVIGATION_PAGE_LIST.calendarPage;
    }
    // 認証が必要なページに未ログインでアクセス
    if (routeDef.requiresAuth && !isSignedIn) {
      redirectTo = NAVIGATION_PAGE_LIST.signInPage;
    }
  } else {
    // 未定義のルートは認証必須として扱う（安全側に倒す）
    if (!isSignedIn) {
      redirectTo = NAVIGATION_PAGE_LIST.signInPage;
    }
  }

  context.set(authContext, { isSignedIn, csrfToken });

  if (redirectTo) {
    throw redirect(redirectTo);
  }
};
