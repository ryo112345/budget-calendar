import { useState, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Calendar } from "~/features/calendar/components/Calendar";
import { MonthlySummary } from "~/features/calendar/components/MonthlySummary";
import { CategoryExpenses } from "~/features/calendar/components/CategoryExpenses";
import { DayDetail } from "~/features/calendar/components/DayDetail";
import { TransactionForm } from "~/features/transactions/components/TransactionForm";
import { useCalendar } from "~/features/calendar/hooks/useCalendar";
import { usePostTransactions, usePatchTransactionsId, useDeleteTransactionsId, getGetTransactionsQueryKey } from "~/apis/transactions/transactions";
import type { Transaction, CreateTransactionInput, UpdateTransactionInput } from "~/apis/model";
import { startOfMonth, endOfMonth, format } from "date-fns";

export default function CalendarPage() {
  const queryClient = useQueryClient();
  const {
    currentDate,
    currentMonthLabel,
    calendarDays,
    transactions,
    monthlySummary,
    categoryExpenses,
    goToPreviousMonth,
    goToNextMonth,
    goToToday,
    getTransactionsForDate,
  } = useCalendar();

  const [selectedDate, setSelectedDate] = useState<{ date: Date; dateString: string } | null>(null);
  const [showTransactionForm, setShowTransactionForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | undefined>();
  const [defaultDate, setDefaultDate] = useState<string | undefined>();

  const invalidateTransactions = useCallback(() => {
    queryClient.invalidateQueries({
      queryKey: getGetTransactionsQueryKey({
        start_date: format(startOfMonth(currentDate), "yyyy-MM-dd"),
        end_date: format(endOfMonth(currentDate), "yyyy-MM-dd"),
      }),
    });
  }, [queryClient, currentDate]);

  const createMutation = usePostTransactions({
    mutation: { onSuccess: invalidateTransactions },
  });

  const updateMutation = usePatchTransactionsId({
    mutation: { onSuccess: invalidateTransactions },
  });

  const deleteMutation = useDeleteTransactionsId({
    mutation: { onSuccess: invalidateTransactions },
  });

  const handleDateClick = (dateString: string) => {
    const day = calendarDays.find((d) => d.dateString === dateString);
    if (day) {
      setSelectedDate({ date: day.date, dateString });
    }
  };

  const handleCloseDayDetail = () => {
    setSelectedDate(null);
  };

  const handleAddTransaction = () => {
    setEditingTransaction(undefined);
    setDefaultDate(selectedDate?.dateString);
    setShowTransactionForm(true);
  };

  const handleEditTransaction = (id: number) => {
    const transaction = transactions.find((t) => t.id === id);
    if (transaction) {
      setEditingTransaction(transaction);
      setDefaultDate(undefined);
      setShowTransactionForm(true);
    }
  };

  const handleCloseForm = () => {
    setShowTransactionForm(false);
    setEditingTransaction(undefined);
    setDefaultDate(undefined);
  };

  const handleSubmit = async (data: CreateTransactionInput | UpdateTransactionInput) => {
    if (editingTransaction) {
      await updateMutation.mutateAsync({ id: editingTransaction.id, data: data as UpdateTransactionInput });
    } else {
      await createMutation.mutateAsync({ data: data as CreateTransactionInput });
    }
  };

  const handleDelete = async () => {
    if (editingTransaction) {
      await deleteMutation.mutateAsync({ id: editingTransaction.id });
    }
  };

  return (
    <div className='space-y-4'>
      {/* PC: 横並び、スマホ: 縦並び */}
      <div className='flex flex-col md:flex-row md:gap-6 md:items-start space-y-4 md:space-y-0'>
        <div className='md:flex-1'>
          <Calendar
            currentMonthLabel={currentMonthLabel}
            calendarDays={calendarDays}
            onPreviousMonth={goToPreviousMonth}
            onNextMonth={goToNextMonth}
            onGoToToday={goToToday}
            onDateClick={handleDateClick}
          />
        </div>
        <div className='md:w-80 lg:w-96 md:shrink-0 space-y-4'>
          <MonthlySummary
            income={monthlySummary.income}
            expense={monthlySummary.expense}
            budget={monthlySummary.budget}
            budgetRemaining={monthlySummary.budgetRemaining}
          />
          <CategoryExpenses expenses={categoryExpenses} />
        </div>
      </div>

      {/* Day detail modal */}
      {selectedDate && (
        <DayDetail
          date={selectedDate.date}
          transactions={getTransactionsForDate(selectedDate.dateString)}
          onClose={handleCloseDayDetail}
          onAddTransaction={handleAddTransaction}
          onEditTransaction={handleEditTransaction}
        />
      )}

      {/* Transaction form modal */}
      {showTransactionForm && (
        <TransactionForm
          transaction={editingTransaction}
          defaultDate={defaultDate}
          onSubmit={handleSubmit}
          onDelete={editingTransaction ? handleDelete : undefined}
          onClose={handleCloseForm}
          isSubmitting={createMutation.isPending || updateMutation.isPending}
          isDeleting={deleteMutation.isPending}
        />
      )}
    </div>
  );
}
