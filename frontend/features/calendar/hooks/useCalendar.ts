import { useState, useCallback, useMemo, useEffect } from "react";
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, addMonths, subMonths, format, isSameMonth, isToday } from "date-fns";
import { useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { useGetTransactions, getGetTransactionsQueryKey, getTransactions } from "~/apis/transactions/transactions";
import { useGetBudgets, getGetBudgetsQueryKey, getBudgets } from "~/apis/budgets/budgets";
import type { Transaction } from "~/apis/model";

export type DailyAmount = {
  income: number;
  expense: number;
};

export type CalendarDay = {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  dateString: string;
  dailyAmount: DailyAmount;
};

export function useCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const queryClient = useQueryClient();

  const goToPreviousMonth = useCallback(() => {
    setCurrentDate((prev) => subMonths(prev, 1));
  }, []);

  const goToNextMonth = useCallback(() => {
    setCurrentDate((prev) => addMonths(prev, 1));
  }, []);

  const goToToday = useCallback(() => {
    setCurrentDate(new Date());
  }, []);

  const yearMonth = useMemo(() => {
    return format(currentDate, "yyyy-MM");
  }, [currentDate]);

  const startDateStr = useMemo(() => {
    return format(startOfMonth(currentDate), "yyyy-MM-dd");
  }, [currentDate]);

  const endDateStr = useMemo(() => {
    return format(endOfMonth(currentDate), "yyyy-MM-dd");
  }, [currentDate]);

  const {
    data: transactionsData,
    isLoading: isTransactionsLoading,
    isFetching: isTransactionsFetching,
  } = useGetTransactions({ start_date: startDateStr, end_date: endDateStr }, { query: { placeholderData: keepPreviousData } });

  const {
    data: budgetsData,
    isLoading: isBudgetsLoading,
    isFetching: isBudgetsFetching,
  } = useGetBudgets({ month: yearMonth }, { query: { placeholderData: keepPreviousData } });

  const transactions = useMemo(() => transactionsData?.transactions ?? [], [transactionsData]);
  const budgets = useMemo(() => budgetsData?.budgets ?? [], [budgetsData]);

  const dailyAmounts = useMemo(() => {
    const amounts: Record<string, DailyAmount> = {};

    for (const tx of transactions) {
      const dateKey = format(new Date(tx.date), "yyyy-MM-dd");
      if (!amounts[dateKey]) {
        amounts[dateKey] = { income: 0, expense: 0 };
      }
      if (tx.category?.type === "income") {
        amounts[dateKey].income += tx.amount;
      } else {
        amounts[dateKey].expense += tx.amount;
      }
    }

    return amounts;
  }, [transactions]);

  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });
    const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });

    return eachDayOfInterval({ start: calendarStart, end: calendarEnd }).map((date): CalendarDay => {
      const dateString = format(date, "yyyy-MM-dd");
      return {
        date,
        isCurrentMonth: isSameMonth(date, currentDate),
        isToday: isToday(date),
        dateString,
        dailyAmount: dailyAmounts[dateString] ?? { income: 0, expense: 0 },
      };
    });
  }, [currentDate, dailyAmounts]);

  const currentMonthLabel = useMemo(() => {
    return format(currentDate, "yyyy年M月");
  }, [currentDate]);

  const monthlySummary = useMemo(() => {
    const income = transactions.filter((tx) => tx.category?.type === "income").reduce((sum, tx) => sum + tx.amount, 0);
    const expense = transactions.filter((tx) => tx.category?.type === "expense").reduce((sum, tx) => sum + tx.amount, 0);
    const budget = budgets.reduce((sum, b) => sum + b.amount, 0);
    const budgetRemaining = budget > 0 ? budget - expense : undefined;

    return { income, expense, budget, budgetRemaining };
  }, [transactions, budgets]);

  const categoryExpenses = useMemo(() => {
    const expenseMap = new Map<number, { categoryName: string; amount: number }>();

    for (const tx of transactions.filter((tx) => tx.category?.type === "expense")) {
      const existing = expenseMap.get(tx.category_id);
      if (existing) {
        existing.amount += tx.amount;
      } else {
        expenseMap.set(tx.category_id, {
          categoryName: tx.category?.name ?? "不明",
          amount: tx.amount,
        });
      }
    }

    // 予算情報を紐づけ
    const budgetMap = new Map<number, number>();
    for (const b of budgets) {
      budgetMap.set(b.category_id, b.amount);
    }

    return Array.from(expenseMap.entries())
      .map(([categoryId, { categoryName, amount }]) => ({
        categoryId,
        categoryName,
        amount,
        budget: budgetMap.get(categoryId),
      }))
      .sort((a, b) => b.amount - a.amount);
  }, [transactions, budgets]);

  const getTransactionsForDate = useCallback(
    (dateString: string) => {
      return transactions.filter((tx) => format(new Date(tx.date), "yyyy-MM-dd") === dateString);
    },
    [transactions],
  );

  // 前後の月のデータをprefetch
  useEffect(() => {
    const prefetchMonth = (date: Date) => {
      const start = format(startOfMonth(date), "yyyy-MM-dd");
      const end = format(endOfMonth(date), "yyyy-MM-dd");
      const month = format(date, "yyyy-MM");

      queryClient.prefetchQuery({
        queryKey: getGetTransactionsQueryKey({ start_date: start, end_date: end }),
        queryFn: () => getTransactions({ start_date: start, end_date: end }),
      });
      queryClient.prefetchQuery({
        queryKey: getGetBudgetsQueryKey({ month }),
        queryFn: () => getBudgets({ month }),
      });
    };

    prefetchMonth(subMonths(currentDate, 1));
    prefetchMonth(addMonths(currentDate, 1));
  }, [currentDate, queryClient]);

  const hasData = !!transactionsData && !!budgetsData;

  return {
    currentDate,
    currentMonthLabel,
    yearMonth,
    calendarDays,
    transactions,
    monthlySummary,
    categoryExpenses,
    isLoading: (isTransactionsLoading || isBudgetsLoading) && !hasData,
    isFetching: isTransactionsFetching || isBudgetsFetching,
    goToPreviousMonth,
    goToNextMonth,
    goToToday,
    getTransactionsForDate,
  };
}
