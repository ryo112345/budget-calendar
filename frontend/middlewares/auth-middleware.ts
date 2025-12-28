import { redirect, type unstable_MiddlewareFunction as MiddlewareFunction } from "react-router";
import { authContext } from "./auth-context";
import { NAVIGATION_PAGE_LIST } from "~/app/routes";
import { getCheckSignedIn } from "~/services/users/api";
import { getCsrfToken } from "~/services/csrf/api";

export const authMiddleware: MiddlewareFunction = async ({ request, context }) => {
  // NOTE: 画面遷移の際にCSRFトークンを取得
  const csrfToken = await getCsrfToken();

  const checkedSignedIn = await getCheckSignedIn(csrfToken);

  let toNavigatePath = "";
  const url = new URL(request.url);
  const pathname = url.pathname;

  // ログインページにいるのに既にログイン済み → カレンダーページへ
  if (pathname === NAVIGATION_PAGE_LIST.signInPage) {
    if (checkedSignedIn) {
      toNavigatePath = NAVIGATION_PAGE_LIST.calendarPage;
    }
  }

  // 認証が必要なページ（トップ、会員登録、ログイン以外）にいるのに未ログイン → ログインページへ
  if (
    pathname !== NAVIGATION_PAGE_LIST.top &&
    pathname !== NAVIGATION_PAGE_LIST.signUpPage &&
    pathname !== NAVIGATION_PAGE_LIST.signInPage
  ) {
    if (!checkedSignedIn) {
      toNavigatePath = NAVIGATION_PAGE_LIST.signInPage;
    }
  }

  context.set(authContext, { isSignedIn: checkedSignedIn, csrfToken });

  if (toNavigatePath !== "") {
    throw redirect(toNavigatePath);
  }
};
