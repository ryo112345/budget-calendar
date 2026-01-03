import type { Transaction } from "~/apis/model";
import { TransactionItem } from "../TransactionItem";

type Props = {
  transactions: Transaction[];
  isLoading?: boolean;
  onEdit?: (id: number) => void;
};

export function TransactionList({ transactions, isLoading, onEdit }: Props) {
  if (isLoading) {
    return null;
  }

  if (transactions.length === 0) {
    return (
      <div className='py-12 text-center text-gray-500'>
        <p>取引がありません</p>
      </div>
    );
  }

  return (
    <div className='divide-y divide-gray-200'>
      {transactions.map((transaction) => (
        <TransactionItem key={transaction.id} transaction={transaction} onEdit={onEdit} />
      ))}
    </div>
  );
}
