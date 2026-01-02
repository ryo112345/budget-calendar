import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useGetCategories } from "~/apis/categories/categories";
import type { Budget, CreateBudgetInput } from "~/apis/model";

type Props = {
  budget: Budget | null;
  isOpen: boolean;
  isSaving: boolean;
  existingCategoryIds: number[];
  onClose: () => void;
  onSubmit: (input: CreateBudgetInput) => void;
};

export function BudgetForm({ budget, isOpen, isSaving, existingCategoryIds, onClose, onSubmit }: Props) {
  const { data: categoriesData, isLoading: isCategoriesLoading } = useGetCategories();
  const allCategories = categoriesData?.categories ?? [];

  const availableCategories = budget ? allCategories : allCategories.filter((cat) => !existingCategoryIds.includes(cat.id));

  const [categoryId, setCategoryId] = useState<number | "">(budget?.category_id ?? "");
  const [amount, setAmount] = useState(budget?.amount?.toString() ?? "");

  // フォームが開かれた時のみ初期化
  useEffect(() => {
    if (!isOpen) return;

    if (budget) {
      setCategoryId(budget.category_id);
      setAmount(budget.amount.toString());
    } else {
      setCategoryId("");
      setAmount("");
    }
  }, [budget, isOpen]);

  // カテゴリの初期選択（availableCategoriesが読み込まれた後）
  useEffect(() => {
    if (!isOpen || budget || categoryId !== "") return;
    if (availableCategories.length > 0) {
      setCategoryId(availableCategories[0].id);
    }
  }, [isOpen, budget, categoryId, availableCategories]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryId || !amount) return;

    const amountValue = parseInt(amount, 10);
    if (isNaN(amountValue) || amountValue <= 0) return;

    onSubmit({
      category_id: categoryId,
      amount: amountValue,
      month: "", // This will be set by the hook
    });
  };

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4'>
      <div className='bg-white rounded-lg w-full max-w-md'>
        <div className='flex items-center justify-between p-4 border-b'>
          <h2 className='text-lg'>{budget ? "予算を編集" : "予算を追加"}</h2>
          <button onClick={onClose} className='p-1 hover:bg-gray-100 rounded'>
            <X className='w-5 h-5' />
          </button>
        </div>
        <form onSubmit={handleSubmit} className='p-4 space-y-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>カテゴリ</label>
            {isCategoriesLoading ? (
              <div className='text-gray-500 text-sm'>読み込み中...</div>
            ) : availableCategories.length === 0 && !budget ? (
              <div className='text-gray-500 text-sm'>
                すべてのカテゴリに予算が設定されています。
                <br />
                新しいカテゴリを追加するか、既存の予算を編集してください。
              </div>
            ) : (
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(parseInt(e.target.value, 10))}
                disabled={!!budget}
                required
                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100'
              >
                {(budget ? allCategories : availableCategories).map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            )}
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>予算額</label>
            <input
              type='number'
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
              placeholder='例: 50000'
              min='1'
              required
            />
          </div>
          <div className='flex gap-2 pt-2'>
            <button type='button' onClick={onClose} className='flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition'>
              キャンセル
            </button>
            <button
              type='submit'
              disabled={isSaving || !categoryId || !amount || (availableCategories.length === 0 && !budget)}
              className='flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50'
            >
              {isSaving ? "保存中..." : "保存"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
