import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ErrorBoundary as ReactErrorBoundary } from "react-error-boundary";
import "./app.css";

const queryClient = new QueryClient();

function Fallback({ error }: { error: Error }) {
  return (
    <div className='flex items-center justify-center min-h-screen bg-gray-50'>
      <div className='text-center'>
        <h1 className='text-6xl font-bold text-red-600'>Error</h1>
        <p className='mt-4 text-gray-600'>{error.message}</p>
      </div>
    </div>
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
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <ReactErrorBoundary fallbackRender={Fallback}>
      <QueryClientProvider client={queryClient}>
        <Outlet />
      </QueryClientProvider>
    </ReactErrorBoundary>
  );
}
