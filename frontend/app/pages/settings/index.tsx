import { Link } from "react-router";
import { ChevronRight, LogOut, Tag, Wallet, type LucideIcon } from "lucide-react";
import { NAVIGATION_PAGE_LIST } from "~/app/routes";
import { useSignOut } from "~/features/auth/hooks/useSignOut";

export default function SettingsPage() {
  const { signOut, isLoading } = useSignOut();

  const menuItems: { label: string; to: string; icon: LucideIcon; iconBg: string; iconColor: string }[] = [
    { label: "カテゴリ管理", to: NAVIGATION_PAGE_LIST.categoriesPage, icon: Tag, iconBg: "bg-blue-100", iconColor: "text-blue-600" },
    { label: "予算設定", to: NAVIGATION_PAGE_LIST.budgetPage, icon: Wallet, iconBg: "bg-green-100", iconColor: "text-green-600" },
  ];

  const handleSignOut = async () => {
    if (confirm("ログアウトしますか？")) {
      await signOut();
    }
  };

  return (
    <div className='mx-auto max-w-md mt-8'>
      <div className='rounded-lg border border-gray-200 bg-white p-6 shadow-md'>
        <h1 className='text-2xl font-normal text-gray-700'>設定</h1>
        <div className='mt-6 space-y-2'>
          {menuItems.map((item) => (
            <Link key={item.to} to={item.to} className='flex items-center gap-4 py-3 px-4 rounded-lg hover:bg-gray-100 transition'>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${item.iconBg}`}>
                <item.icon className={`w-5 h-5 ${item.iconColor}`} />
              </div>
              <span className='flex-1 text-gray-800'>{item.label}</span>
              <ChevronRight className='w-5 h-5 text-gray-400' />
            </Link>
          ))}
        </div>

        <div className='mt-8 flex justify-end'>
          <button
            onClick={handleSignOut}
            disabled={isLoading}
            className='flex items-center gap-2 px-5 py-1.5 rounded-full text-red-600 hover:bg-red-50 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'
          >
            <LogOut className='w-5 h-5' />
            <span>{isLoading ? "ログアウト中..." : "ログアウト"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
