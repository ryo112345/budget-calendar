import { useEffect } from "react";
import { useNavigate, Link } from "react-router";
import { useAuth } from "~/features/auth/hooks/useAuth";
import { NAVIGATION_PAGE_LIST } from "~/app/routes";

export default function Home() {
  const { isSignedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isSignedIn) {
      navigate(NAVIGATION_PAGE_LIST.calendarPage, { replace: true });
    }
  }, [isSignedIn, navigate]);

  if (isSignedIn) {
    return null;
  }

  return (
    <div className='flex items-center justify-center min-h-screen bg-gray-50'>
      <div className='text-center'>
        <h1 className='text-4xl font-bold text-blue-600'>Budget Calendar</h1>
        <p className='mt-4 text-gray-600'>カレンダー形式で予算管理を行うアプリケーション</p>
        <div className='mt-8 flex gap-4 justify-center'>
          <Link to={NAVIGATION_PAGE_LIST.signInPage} className='px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition'>
            ログイン
          </Link>
          <Link
            to={NAVIGATION_PAGE_LIST.signUpPage}
            className='px-6 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition'
          >
            新規登録
          </Link>
        </div>
      </div>
    </div>
  );
}
