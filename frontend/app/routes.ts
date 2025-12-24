import { type RouteConfig, index } from "@react-router/dev/routes";

export const NAVIGATION_PAGE_LIST = {
  top: "/",
  signUpPage: "/sign_up",
  signInPage: "/sign_in",
  calendarPage: "/calendar",
};

export default [index("routes/home.tsx")] satisfies RouteConfig;
