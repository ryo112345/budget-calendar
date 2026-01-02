import { NavLink } from "react-router";
import { Calendar, Receipt, Settings } from "lucide-react";
import { NAVIGATION_PAGE_LIST } from "~/app/routes";
import { useAuth } from "~/features/auth/hooks/useAuth";

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

export function BottomNavigation() {
  const { isSignedIn } = useAuth();

  if (!isSignedIn) {
    return null;
  }

  return (
    <nav className='fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 md:hidden'>
      <div className='flex justify-around items-center h-16'>
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center flex-1 h-full transition ${isActive ? "text-blue-600" : "text-gray-500 hover:text-gray-700"}`
            }
          >
            <item.icon className='w-6 h-6' />
            <span className='text-xs mt-1'>{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
