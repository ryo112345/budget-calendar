import { Link, Links, Meta, Outlet, Scripts, ScrollRestoration, useRouteLoaderData } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ErrorBoundary as ReactErrorBoundary } from "react-error-boundary";
import { Toaster } from "sonner";

import type { Route } from "./+types/root";
import "./app.css";
import Container from "~/shared/components/ui/Container";
import { HeaderNavigation } from "~/shared/components/layout/HeaderNavigation";
import { BottomNavigation } from "~/shared/components/layout/BottomNavigation";
import { authMiddleware } from "~/features/auth/auth-middleware";
import { authContext, type AuthState } from "~/features/auth/auth-context";
import { NAVIGATION_PAGE_LIST } from "./routes";

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export const clientMiddleware = [authMiddleware];

export async function clientLoader({ context }: Route.ClientLoaderArgs) {
  // middlewareでセット済みの認証状態を取得して返す
  const auth = context.get(authContext);
  return { isSignedIn: auth?.isSignedIn ?? false, csrfToken: auth?.csrfToken ?? "" };
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5分間はキャッシュを使用
      gcTime: 10 * 60 * 1000, // 10分間キャッシュを保持
    },
  },
});

function Fallback({ error }: { error: Error }) {
  return (
    <>
      {import.meta.env.PROD ? (
        <div className='text-gray-800 flex items-center justify-center h-screen'>
          <div className='text-center'>
            <h1 className='text-8xl font-bold text-red-600'>500</h1>
            <h2 className='text-2xl mt-4 font-semibold'>Internal Server Error</h2>
            <p className='mt-2 text-gray-600'>サーバーでエラーが発生しました。しばらくしてから再度お試しください。</p>
            <div className='mt-6'>
              <Link to={NAVIGATION_PAGE_LIST.top} className='bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'>
                ホームに戻る
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <main className='pt-16 p-4 container mx-auto'>
          <h1>{error.message}</h1>
          {error.stack && (
            <pre className='w-full p-4 overflow-x-auto'>
              <code>{error.stack}</code>
            </pre>
          )}
        </main>
      )}
    </>
  );
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='ja'>
      <head>
        <meta charSet='utf-8' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <Meta />
        <Links />
      </head>
      <body className='bg-[#f8f9fa] min-h-screen'>
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
        <Toaster position='top-center' richColors closeButton />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

function AppContent() {
  const data = useRouteLoaderData("root") as AuthState | undefined;
  const isSignedIn = data?.isSignedIn ?? false;

  return (
    <HeaderNavigation>
      <Container containerWidth='w-4/5'>
        <div className={isSignedIn ? "pb-20" : ""}>
          <Outlet />
        </div>
      </Container>
    </HeaderNavigation>
  );
}

export default function App() {
  return (
    <ReactErrorBoundary fallbackRender={Fallback}>
      <AppContent />
      <BottomNavigation />
    </ReactErrorBoundary>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  return (
    <>
      <Fallback error={error as Error} />
    </>
  );
}
