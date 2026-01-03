import { useState, useCallback, useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { format, addMonths, subMonths } from "date-fns";
import { toast } from "sonner";
import { useGetBudgets, usePostBudgets, usePatchBudgetsId, useDeleteBudgetsId } from "~/apis/budgets/budgets";
import type { Budget, CreateBudgetInput, UpdateBudgetInput } from "~/apis/model";

export function useBudgets() {
  const queryClient = useQueryClient();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const yearMonth = useMemo(() => format(currentDate, "yyyy-MM"), [currentDate]);
  const currentMonthLabel = useMemo(() => format(currentDate, "yyyy年M月"), [currentDate]);

  const goToPreviousMonth = useCallback(() => {
    setCurrentDate((prev) => subMonths(prev, 1));
  }, []);

  const goToNextMonth = useCallback(() => {
    setCurrentDate((prev) => addMonths(prev, 1));
  }, []);

  const { data, isLoading, error } = useGetBudgets({ month: yearMonth });
  const budgets = useMemo(() => data?.budgets ?? [], [data]);

  const invalidateBudgets = useCallback(() => {
    // すべての予算クエリを無効化（カレンダーページのキャッシュも含む）
    queryClient.invalidateQueries({ queryKey: ["/budgets"] });
  }, [queryClient]);

  const { mutate: createBudget, isPending: isCreating } = usePostBudgets({
    mutation: {
      onSuccess: () => {
        invalidateBudgets();
        toast.success("予算を作成しました");
        closeForm();
      },
      onError: () => {
        toast.error("予算の作成に失敗しました");
      },
    },
  });

  const { mutate: updateBudget, isPending: isUpdating } = usePatchBudgetsId({
    mutation: {
      onSuccess: () => {
        invalidateBudgets();
        toast.success("予算を更新しました");
        closeForm();
      },
      onError: () => {
        toast.error("予算の更新に失敗しました");
      },
    },
  });

  const { mutate: deleteBudget, isPending: isDeleting } = useDeleteBudgetsId({
    mutation: {
      onSuccess: () => {
        invalidateBudgets();
        toast.success("予算を削除しました");
      },
      onError: () => {
        toast.error("予算の削除に失敗しました");
      },
    },
  });

  const openCreateForm = useCallback(() => {
    setEditingBudget(null);
    setIsFormOpen(true);
  }, []);

  const openEditForm = useCallback((budget: Budget) => {
    setEditingBudget(budget);
    setIsFormOpen(true);
  }, []);

  const closeForm = useCallback(() => {
    setEditingBudget(null);
    setIsFormOpen(false);
  }, []);

  const handleSubmit = useCallback(
    (input: CreateBudgetInput | UpdateBudgetInput) => {
      if (editingBudget) {
        // 編集時は category_id と amount のみ送信（month は除外）
        const updateData: UpdateBudgetInput = {
          category_id: input.category_id,
          amount: input.amount,
        };
        updateBudget({ id: editingBudget.id, data: updateData });
      } else {
        createBudget({ data: { ...input, month: yearMonth } as CreateBudgetInput });
      }
    },
    [editingBudget, createBudget, updateBudget, yearMonth],
  );

  const handleDelete = useCallback(
    (id: number) => {
      if (window.confirm("この予算を削除しますか？")) {
        deleteBudget({ id });
      }
    },
    [deleteBudget],
  );

  const totalBudget = useMemo(() => {
    return budgets.reduce((sum, budget) => sum + budget.amount, 0);
  }, [budgets]);

  return {
    budgets,
    totalBudget,
    isLoading,
    error,
    yearMonth,
    currentMonthLabel,
    editingBudget,
    isFormOpen,
    isSaving: isCreating || isUpdating,
    isDeleting,
    goToPreviousMonth,
    goToNextMonth,
    openCreateForm,
    openEditForm,
    closeForm,
    handleSubmit,
    handleDelete,
  };
}
