import type { Route } from "./+types/page";
import { authContext } from "~/middlewares/auth-context";
import { useLoaderData } from "react-router";
import { useAuth } from "~/hooks/useAuth";

export async function clientLoader({ context }: Route.ClientLoaderArgs) {
  const auth = context.get(authContext);

  return { isSignedIn: !!auth?.isSignedIn, csrfToken: auth?.csrfToken ?? "" };
}

export default function CalendarPage() {
  const { isSignedIn, csrfToken } = useLoaderData<typeof clientLoader>();

  useAuth(isSignedIn, csrfToken);

  return (
    <>
      <h1 className='mt-16 text-2xl font-bold text-center'>カレンダー</h1>
      <p className='mt-4 text-center text-gray-600'>
        ここにカレンダーが表示されます（フェーズ2で実装予定）
      </p>
    </>
  );
}
