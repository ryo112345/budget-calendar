import { useState, useCallback, useMemo, useEffect } from "react";
import { addMonths, subMonths, format, startOfMonth, endOfMonth } from "date-fns";
import { useQueryClient, keepPreviousData } from "@tanstack/react-query";
import {
  useGetTransactions,
  usePostTransactions,
  usePatchTransactionsId,
  useDeleteTransactionsId,
  getGetTransactionsQueryKey,
  getTransactions,
} from "~/apis/transactions/transactions";
import type { CreateTransactionInput, UpdateTransactionInput, Transaction } from "~/apis/model";

export function useTransactions() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const queryClient = useQueryClient();

  const goToPreviousMonth = useCallback(() => {
    setCurrentDate((prev) => subMonths(prev, 1));
  }, []);

  const goToNextMonth = useCallback(() => {
    setCurrentDate((prev) => addMonths(prev, 1));
  }, []);

  const currentMonthLabel = useMemo(() => {
    return format(currentDate, "yyyy年M月");
  }, [currentDate]);

  const yearMonth = useMemo(() => {
    return format(currentDate, "yyyy-MM");
  }, [currentDate]);

  const startDate = useMemo(() => {
    return startOfMonth(currentDate);
  }, [currentDate]);

  const endDate = useMemo(() => {
    return endOfMonth(currentDate);
  }, [currentDate]);

  const { data, isLoading, error, isFetching } = useGetTransactions(
    {
      start_date: format(startDate, "yyyy-MM-dd"),
      end_date: format(endDate, "yyyy-MM-dd"),
    },
    {
      query: {
        placeholderData: keepPreviousData,
      },
    },
  );

  const transactions = useMemo(() => {
    return data?.transactions ?? [];
  }, [data]);

  const invalidateTransactions = useCallback(() => {
    queryClient.invalidateQueries({
      queryKey: getGetTransactionsQueryKey({ start_date: format(startDate, "yyyy-MM-dd"), end_date: format(endDate, "yyyy-MM-dd") }),
    });
  }, [queryClient, startDate, endDate]);

  const createMutation = usePostTransactions({
    mutation: {
      onSuccess: () => {
        invalidateTransactions();
      },
    },
  });

  const updateMutation = usePatchTransactionsId({
    mutation: {
      onSuccess: () => {
        invalidateTransactions();
      },
    },
  });

  const deleteMutation = useDeleteTransactionsId({
    mutation: {
      onSuccess: () => {
        invalidateTransactions();
      },
    },
  });

  const createTransaction = useCallback(
    async (input: CreateTransactionInput) => {
      return createMutation.mutateAsync({ data: input });
    },
    [createMutation],
  );

  const updateTransaction = useCallback(
    async (id: number, input: UpdateTransactionInput) => {
      return updateMutation.mutateAsync({ id, data: input });
    },
    [updateMutation],
  );

  const deleteTransaction = useCallback(
    async (id: number) => {
      return deleteMutation.mutateAsync({ id });
    },
    [deleteMutation],
  );

  // 前後の月のデータをprefetch
  useEffect(() => {
    const prevMonth = subMonths(currentDate, 1);
    const nextMonth = addMonths(currentDate, 1);

    const prefetchMonth = (date: Date) => {
      const start = format(startOfMonth(date), "yyyy-MM-dd");
      const end = format(endOfMonth(date), "yyyy-MM-dd");
      queryClient.prefetchQuery({
        queryKey: getGetTransactionsQueryKey({ start_date: start, end_date: end }),
        queryFn: () => getTransactions({ start_date: start, end_date: end }),
      });
    };

    prefetchMonth(prevMonth);
    prefetchMonth(nextMonth);
  }, [currentDate, queryClient]);

  return {
    currentDate,
    currentMonthLabel,
    yearMonth,
    startDate,
    endDate,
    transactions,
    isLoading: isLoading && !data, // 初回ローディングのみtrue
    isFetching, // バックグラウンドフェッチ中
    error,
    goToPreviousMonth,
    goToNextMonth,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
