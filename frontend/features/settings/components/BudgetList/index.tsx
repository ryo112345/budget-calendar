import { Pencil, Trash2 } from "lucide-react";
import type { Budget } from "~/apis/model";

type Props = {
  budgets: Budget[];
  isDeleting: boolean;
  onEdit: (budget: Budget) => void;
  onDelete: (id: number) => void;
};

export function BudgetList({ budgets, isDeleting, onEdit, onDelete }: Props) {
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("ja-JP").format(amount);
  };

  if (budgets.length === 0) {
    return (
      <div className='py-12 text-center text-gray-500'>
        <p>予算が設定されていません</p>
        <p className='text-sm mt-1'>「追加」ボタンからカテゴリごとの予算を設定してください</p>
      </div>
    );
  }

  return (
    <div className='divide-y divide-gray-200'>
      {budgets.map((budget) => (
        <div key={budget.id} className='flex items-center justify-between py-3 px-4'>
          <div className='flex items-center gap-3'>
            <div className='w-4 h-4 rounded-full' style={{ backgroundColor: budget.category?.color ?? "#6b7280" }} />
            <div>
              <span className='text-gray-800'>{budget.category?.name ?? "未分類"}</span>
            </div>
          </div>
          <div className='flex items-center gap-3'>
            <span className='font-medium text-gray-800'>{formatAmount(budget.amount)}円</span>
            <div className='flex items-center gap-1'>
              <button
                onClick={() => onEdit(budget)}
                className='p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition'
                title='編集'
              >
                <Pencil className='w-4 h-4' />
              </button>
              <button
                onClick={() => onDelete(budget.id)}
                disabled={isDeleting}
                className='p-2 text-gray-500 hover:text-red-600 hover:bg-gray-100 rounded transition disabled:opacity-50'
                title='削除'
              >
                <Trash2 className='w-4 h-4' />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
