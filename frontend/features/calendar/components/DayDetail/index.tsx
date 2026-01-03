import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { X, Plus } from "lucide-react";
import type { Transaction } from "~/apis/model";

type Props = {
  date: Date;
  transactions: Transaction[];
  onClose: () => void;
  onAddTransaction: () => void;
  onEditTransaction: (id: number) => void;
};

export function DayDetail({ date, transactions, onClose, onAddTransaction, onEditTransaction }: Props) {
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("ja-JP").format(amount);
  };

  const income = transactions.filter((t) => t.category?.type === "income").reduce((sum, t) => sum + t.amount, 0);
  const expense = transactions.filter((t) => t.category?.type === "expense").reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4'>
      <div className='bg-white rounded-lg w-full max-w-md max-h-[80vh] flex flex-col'>
        {/* Header */}
        <div className='flex items-center justify-between p-4 border-b'>
          <h2 className='text-lg font-bold'>{format(date, "M月d日（E）", { locale: ja })}</h2>
          <button onClick={onClose} className='p-1 hover:bg-gray-100 rounded'>
            <X className='w-5 h-5' />
          </button>
        </div>

        {/* Summary */}
        <div className='p-4 border-b bg-gray-50'>
          <div className='flex justify-center gap-24 text-lg'>
            <div>
              <span className='text-gray-600'>収入: </span>
              <span className='text-green-600 font-medium'>+{formatAmount(income)}</span>
            </div>
            <div>
              <span className='text-gray-600'>支出: </span>
              <span className='text-red-600 font-medium'>-{formatAmount(expense)}</span>
            </div>
          </div>
        </div>

        {/* Transaction list */}
        <div className='flex-1 overflow-y-auto'>
          {transactions.length === 0 ? (
            <div className='py-12 text-center text-gray-500'>
              <p>この日の取引はありません</p>
            </div>
          ) : (
            <div className='divide-y divide-gray-200'>
              {transactions.map((transaction) => (
                <button
                  key={transaction.id}
                  onClick={() => onEditTransaction(transaction.id)}
                  className='w-full flex items-center justify-between py-3 px-4 hover:bg-gray-50 transition text-left'
                >
                  <div className='flex items-center gap-3'>
                    <div className='w-3 h-3 rounded-full' style={{ backgroundColor: transaction.category?.color ?? "#6b7280" }} />
                    <div>
                      <div className='text-gray-800'>{transaction.category?.name ?? "未分類"}</div>
                      {transaction.description && <div className='text-sm text-gray-500'>{transaction.description}</div>}
                    </div>
                  </div>
                  <div className={`font-medium ${transaction.category?.type === "income" ? "text-green-600" : "text-red-600"}`}>
                    {transaction.category?.type === "income" ? "+" : "-"}
                    {formatAmount(transaction.amount)}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Add button */}
        <div className='p-4 border-t'>
          <button
            onClick={onAddTransaction}
            className='w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition'
          >
            <Plus className='w-5 h-5' />
            <span>取引を追加</span>
          </button>
        </div>
      </div>
    </div>
  );
}
