import { redirect, type MiddlewareFunction } from "react-router";
import { authContext } from "./auth-context";
import { getRouteDefinition, NAVIGATION_PAGE_LIST } from "~/app/routes";
import { getCheckSignedIn } from "./services/users-api";
import { getCsrfToken } from "./services/csrf-api";
import { setCsrfToken as storeCsrfToken } from "~/shared/lib/csrf-store";

async function getAuthState(): Promise<{ csrfToken: string; isSignedIn: boolean }> {
  const csrfToken = await getCsrfToken();
  // CSRFトークンをグローバルストレージに保存（customFetchで使用）
  storeCsrfToken(csrfToken);
  const isSignedIn = await getCheckSignedIn(csrfToken);
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
      // ログイン後に元のページに戻れるようにクエリパラメータで保存
      const redirectUrl = new URL(NAVIGATION_PAGE_LIST.signInPage, url.origin);
      redirectUrl.searchParams.set("redirect", pathname);
      redirectTo = redirectUrl.pathname + redirectUrl.search;
    }
  } else {
    // 未定義のルートは認証必須として扱う（安全側に倒す）
    if (!isSignedIn) {
      const redirectUrl = new URL(NAVIGATION_PAGE_LIST.signInPage, url.origin);
      redirectUrl.searchParams.set("redirect", pathname);
      redirectTo = redirectUrl.pathname + redirectUrl.search;
    }
  }

  context.set(authContext, { isSignedIn, csrfToken });

  if (redirectTo) {
    throw redirect(redirectTo);
  }
};
