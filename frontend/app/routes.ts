import { type RouteConfig, index, route } from "@react-router/dev/routes";

const NAVIGATION_PATH_LIST = {
  top: "/",
  signUpPage: "sign_up",
  signInPage: "sign_in",
  calendarPage: "calendar",
};

export const NAVIGATION_PAGE_LIST = {
  top: NAVIGATION_PATH_LIST.top,
  signUpPage: `/${NAVIGATION_PATH_LIST.signUpPage}`,
  signInPage: `/${NAVIGATION_PATH_LIST.signInPage}`,
  calendarPage: `/${NAVIGATION_PATH_LIST.calendarPage}`,
};

export default [
  index("routes/home.tsx"),
  route(NAVIGATION_PATH_LIST.signUpPage, "sign_up/page.tsx"),
  route(NAVIGATION_PATH_LIST.signInPage, "sign_in/page.tsx"),
  route(NAVIGATION_PATH_LIST.calendarPage, "calendar/page.tsx"),
] satisfies RouteConfig;
