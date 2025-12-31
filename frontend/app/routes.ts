import { type RouteConfig, index, route } from "@react-router/dev/routes";

type RouteDefinition = {
  path: string;
  file: string;
  requiresAuth: boolean;
  redirectIfAuthenticated?: boolean; // ログイン済みならリダイレクト（ログインページ用）
};

const ROUTE_DEFINITIONS: RouteDefinition[] = [
  { path: "/", file: "pages/home.tsx", requiresAuth: false },
  { path: "/sign-up", file: "pages/sign-up.tsx", requiresAuth: false },
  { path: "/sign-in", file: "pages/sign-in.tsx", requiresAuth: false, redirectIfAuthenticated: true },
  { path: "/calendar", file: "pages/calendar.tsx", requiresAuth: true },
];

export const NAVIGATION_PAGE_LIST = {
  top: "/",
  signUpPage: "/sign-up",
  signInPage: "/sign-in",
  calendarPage: "/calendar",
};

export function getRouteDefinition(pathname: string): RouteDefinition | undefined {
  return ROUTE_DEFINITIONS.find((r) => r.path === pathname);
}

export default ROUTE_DEFINITIONS.map((r) => (r.path === "/" ? index(r.file) : route(r.path.slice(1), r.file))) satisfies RouteConfig;
