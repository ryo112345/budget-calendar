import { useState } from "react";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { TransactionList } from "~/features/transactions/components/TransactionList";
import { TransactionForm } from "~/features/transactions/components/TransactionForm";
import { useTransactions } from "~/features/transactions/hooks/useTransactions";
import type { Transaction, CreateTransactionInput, UpdateTransactionInput } from "~/apis/model";

export default function TransactionsPage() {
  const {
    currentMonthLabel,
    transactions,
    isLoading,
    goToPreviousMonth,
    goToNextMonth,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    isCreating,
    isUpdating,
    isDeleting,
  } = useTransactions();

  const [showForm, setShowForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | undefined>();

  const handleEdit = (id: number) => {
    const transaction = transactions.find((t) => t.id === id);
    if (transaction) {
      setEditingTransaction(transaction);
      setShowForm(true);
    }
  };

  const handleAdd = () => {
    setEditingTransaction(undefined);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingTransaction(undefined);
  };

  const handleSubmit = async (data: CreateTransactionInput | UpdateTransactionInput) => {
    if (editingTransaction) {
      await updateTransaction(editingTransaction.id, data);
    } else {
      await createTransaction(data as CreateTransactionInput);
    }
  };

  const handleDelete = async () => {
    if (editingTransaction) {
      await deleteTransaction(editingTransaction.id);
    }
  };

  return (
    <div className='mx-auto max-w-2xl space-y-4'>
      {/* Header */}
      <div className='flex items-center gap-4'>
        <h1 className='text-2xl font-normal text-gray-700'>取引一覧</h1>
        <button
          onClick={handleAdd}
          className='flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-full hover:bg-gray-50 transition shadow-sm'
        >
          <Plus className='w-5 h-5' />
          <span>作成</span>
        </button>
      </div>

      {/* Month selector */}
      <div className='flex items-center justify-center gap-4 bg-white rounded-lg shadow p-3'>
        <button onClick={goToPreviousMonth} className='p-2 hover:bg-gray-100 rounded-full transition' aria-label='前月'>
          <ChevronLeft className='w-5 h-5' />
        </button>
        <span className='text-lg font-medium'>{currentMonthLabel}</span>
        <button onClick={goToNextMonth} className='p-2 hover:bg-gray-100 rounded-full transition' aria-label='次月'>
          <ChevronRight className='w-5 h-5' />
        </button>
      </div>

      {/* Transaction list */}
      <div className='bg-white rounded-lg shadow'>
        <TransactionList transactions={transactions} isLoading={isLoading} onEdit={handleEdit} />
      </div>

      {/* Transaction form modal */}
      {showForm && (
        <TransactionForm
          transaction={editingTransaction}
          onSubmit={handleSubmit}
          onDelete={editingTransaction ? handleDelete : undefined}
          onClose={handleCloseForm}
          isSubmitting={isCreating || isUpdating}
          isDeleting={isDeleting}
        />
      )}
    </div>
  );
}
