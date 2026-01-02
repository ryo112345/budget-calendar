import { useState, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  useGetCategories,
  usePostCategories,
  usePatchCategoriesId,
  useDeleteCategoriesId,
  getGetCategoriesQueryKey,
} from "~/apis/categories/categories";
import type { Category, CreateCategoryInput, UpdateCategoryInput } from "~/apis/model";
import { isApiError, getErrorMessage } from "~/shared/lib/errors";

export function useCategories() {
  const queryClient = useQueryClient();
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const { data, isLoading, error } = useGetCategories();
  const categories = data?.categories ?? [];

  const { mutate: createCategory, isPending: isCreating } = usePostCategories({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetCategoriesQueryKey() });
        toast.success("カテゴリを作成しました");
        closeForm();
      },
      onError: () => {
        toast.error("カテゴリの作成に失敗しました");
      },
    },
  });

  const { mutate: updateCategory, isPending: isUpdating } = usePatchCategoriesId({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetCategoriesQueryKey() });
        toast.success("カテゴリを更新しました");
        closeForm();
      },
      onError: () => {
        toast.error("カテゴリの更新に失敗しました");
      },
    },
  });

  const { mutate: deleteCategory, isPending: isDeleting } = useDeleteCategoriesId({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetCategoriesQueryKey() });
        toast.success("カテゴリを削除しました");
      },
      onError: (error) => {
        const message = isApiError(error) ? getErrorMessage(error.reason) : "カテゴリの削除に失敗しました";
        toast.error(message);
      },
    },
  });

  const openCreateForm = useCallback(() => {
    setEditingCategory(null);
    setIsFormOpen(true);
  }, []);

  const openEditForm = useCallback((category: Category) => {
    setEditingCategory(category);
    setIsFormOpen(true);
  }, []);

  const closeForm = useCallback(() => {
    setEditingCategory(null);
    setIsFormOpen(false);
  }, []);

  const handleSubmit = useCallback(
    (input: CreateCategoryInput | UpdateCategoryInput) => {
      if (editingCategory) {
        updateCategory({ id: editingCategory.id, data: input as UpdateCategoryInput });
      } else {
        createCategory({ data: input as CreateCategoryInput });
      }
    },
    [editingCategory, createCategory, updateCategory],
  );

  const handleDelete = useCallback(
    (id: number) => {
      if (window.confirm("このカテゴリを削除しますか？")) {
        deleteCategory({ id });
      }
    },
    [deleteCategory],
  );

  return {
    categories,
    isLoading,
    error,
    editingCategory,
    isFormOpen,
    isSaving: isCreating || isUpdating,
    isDeleting,
    openCreateForm,
    openEditForm,
    closeForm,
    handleSubmit,
    handleDelete,
  };
}
