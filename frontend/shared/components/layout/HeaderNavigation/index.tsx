import { NavLink, Link } from "react-router";
import { Calendar, Receipt, Settings } from "lucide-react";
import { NAVIGATION_PAGE_LIST } from "~/app/routes";
import { useAuth } from "~/features/auth/hooks/useAuth";

type Props = {
  children: React.ReactNode;
};

const navItems = [
  {
    to: NAVIGATION_PAGE_LIST.calendarPage,
    label: "カレンダー",
    icon: Calendar,
  },
  {
    to: NAVIGATION_PAGE_LIST.transactionsPage,
    label: "取引",
    icon: Receipt,
  },
  {
    to: NAVIGATION_PAGE_LIST.settingsPage,
    label: "設定",
    icon: Settings,
  },
];

export function HeaderNavigation({ children }: Props) {
  const { isSignedIn } = useAuth();

  return (
    <>
      <header className='bg-white py-4 px-6 border-b fixed top-0 left-0 w-full z-100'>
        <div className='mx-auto flex items-center justify-between'>
          <h1 className='text-lg md:text-2xl font-semibold text-gray-800'>
            <Link to={NAVIGATION_PAGE_LIST.top}>Budget Calendar</Link>
          </h1>

          {isSignedIn && (
            // PC用ナビゲーション（md以上で表示）
            <nav className='hidden md:flex items-center space-x-6'>
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center space-x-1 px-5 py-1.5 rounded-full transition ${isActive ? "text-blue-600 font-medium" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"}`
                  }
                >
                  <item.icon className='w-4 h-4' />
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </nav>
          )}
        </div>
      </header>
      <div className='mx-auto pt-20 px-6'>{children}</div>
    </>
  );
}
