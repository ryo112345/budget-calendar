import { useState } from "react";
import { format } from "date-fns";
import { X } from "lucide-react";
import type { Transaction, Category, TransactionType, CreateTransactionInput, UpdateTransactionInput } from "~/apis/model";
import { useGetCategories } from "~/apis/categories/categories";
import { formatNumberWithCommas, parseFormattedNumber } from "~/shared/lib/format";

type Props = {
  transaction?: Transaction;
  defaultDate?: string;
  onSubmit: (data: CreateTransactionInput | UpdateTransactionInput) => Promise<void>;
  onDelete?: () => Promise<void>;
  onClose: () => void;
  isSubmitting: boolean;
  isDeleting?: boolean;
};

export function TransactionForm({ transaction, defaultDate, onSubmit, onDelete, onClose, isSubmitting, isDeleting }: Props) {
  const isEditing = !!transaction;
  const { data: categoriesData, isLoading: isCategoriesLoading } = useGetCategories();
  const categories = categoriesData?.categories ?? [];

  const getInitialDate = () => {
    if (transaction?.date) {
      return format(new Date(transaction.date), "yyyy-MM-dd");
    }
    if (defaultDate) {
      return defaultDate;
    }
    return format(new Date(), "yyyy-MM-dd");
  };

  const [type, setType] = useState<TransactionType>(transaction?.type ?? "expense");
  const [amount, setAmount] = useState(transaction?.amount ? formatNumberWithCommas(transaction.amount) : "");
  const [categoryId, setCategoryId] = useState<number | "">(transaction?.category_id ?? "");
  const [date, setDate] = useState(getInitialDate());
  const [description, setDescription] = useState(transaction?.description ?? "");
  const [error, setError] = useState("");

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = parseFormattedNumber(e.target.value);
    if (raw === "" || /^\d+$/.test(raw)) {
      setAmount(raw === "" ? "" : formatNumberWithCommas(raw));
    }
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!categoryId) {
      setError("カテゴリを選択してください");
      return;
    }

    const amountValue = parseInt(parseFormattedNumber(amount), 10);
    if (isNaN(amountValue) || amountValue <= 0) {
      setError("金額を正しく入力してください");
      return;
    }

    try {
      const data = {
        type,
        amount: amountValue,
        category_id: categoryId,
        date,
        description: description || undefined,
      };
      await onSubmit(data);
      onClose();
    } catch (err) {
      setError("保存に失敗しました");
    }
  };

  const handleDelete = async () => {
    if (!onDelete) return;
    if (!confirm("この取引を削除しますか？")) return;

    try {
      await onDelete();
      onClose();
    } catch (err) {
      setError("削除に失敗しました");
    }
  };

  return (
    <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4'>
      <div className='bg-white rounded-lg w-full max-w-md'>
        <div className='flex items-center justify-between p-4 border-b'>
          <h2 className='text-lg font-normal text-gray-700'>{isEditing ? "取引を編集" : "取引を追加"}</h2>
          <button onClick={onClose} className='p-1 hover:bg-gray-100 rounded'>
            <X className='w-5 h-5' />
          </button>
        </div>

        <form onSubmit={handleSubmit} className='p-4 space-y-4'>
          {error && <div className='text-red-600 text-sm bg-red-50 p-2 rounded'>{error}</div>}

          {/* Type selector */}
          <div className='flex gap-2'>
            <button
              type='button'
              onClick={() => setType("expense")}
              className={`flex-1 py-2 rounded-lg font-medium transition ${
                type === "expense" ? "bg-red-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              支出
            </button>
            <button
              type='button'
              onClick={() => setType("income")}
              className={`flex-1 py-2 rounded-lg font-medium transition ${
                type === "income" ? "bg-green-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              収入
            </button>
          </div>

          {/* Amount */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>金額</label>
            <input
              type='text'
              inputMode='numeric'
              value={amount}
              onChange={handleAmountChange}
              placeholder='0'
              required
              className='w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
          </div>

          {/* Category */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>カテゴリ</label>
            {isCategoriesLoading ? (
              <div className='text-gray-500 text-sm'>読み込み中...</div>
            ) : categories.length === 0 ? (
              <div className='text-gray-500 text-sm'>カテゴリがありません。設定から追加してください。</div>
            ) : (
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value ? parseInt(e.target.value, 10) : "")}
                required
                className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${categoryId === "" ? "text-gray-400" : ""}`}
              >
                <option value="" disabled className="text-gray-400">選択してください</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Date */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>日付</label>
            <input
              type='date'
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className='w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
          </div>

          {/* Description */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>メモ（任意）</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder='メモを入力'
              maxLength={255}
              rows={3}
              className='w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none'
            />
          </div>

          {/* Actions */}
          <div className='flex gap-2 pt-2'>
            {isEditing && onDelete && (
              <button
                type='button'
                onClick={handleDelete}
                disabled={isDeleting}
                className='px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition disabled:opacity-50'
              >
                {isDeleting ? "削除中..." : "削除"}
              </button>
            )}
            <div className='flex-1' />
            <button type='button' onClick={onClose} className='px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition'>
              キャンセル
            </button>
            <button
              type='submit'
              disabled={isSubmitting || categories.length === 0}
              className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50'
            >
              {isSubmitting ? "保存中..." : "保存"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
