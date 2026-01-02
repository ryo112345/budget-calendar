import { format } from "date-fns";
import type { Transaction } from "~/apis/model";

type Props = {
  transaction: Transaction;
  onEdit?: (id: number) => void;
};

export function TransactionItem({ transaction, onEdit }: Props) {
  const isIncome = transaction.type === "income";

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("ja-JP").format(amount);
  };

  return (
    <button
      onClick={() => onEdit?.(transaction.id)}
      className='w-full flex items-center justify-between py-3 px-4 hover:bg-gray-50 transition text-left cursor-pointer'
    >
      <div className='flex items-center gap-3'>
        <div className='text-base text-gray-500'>{format(new Date(transaction.date), "M/d")}</div>
        <div className='text-gray-800'>{transaction.category?.name ?? "未分類"}</div>
        {transaction.description && <div className='text-sm text-gray-500 whitespace-pre-wrap'>{transaction.description}</div>}
      </div>
      <div className={`font-medium ${isIncome ? "text-green-600" : "text-red-600"}`}>
        {isIncome ? "+" : "-"}
        {formatAmount(transaction.amount)}
      </div>
    </button>
  );
}
