import { Link } from "react-router";
import { ArrowLeft, Plus } from "lucide-react";
import { NAVIGATION_PAGE_LIST } from "~/app/routes";
import { CategoryList } from "~/features/settings/components/CategoryList";
import { CategoryForm } from "~/features/settings/components/CategoryForm";
import { useCategories } from "~/features/settings/hooks/useCategories";

export default function CategoriesPage() {
  const {
    categories,
    isLoading,
    editingCategory,
    isFormOpen,
    isSaving,
    isDeleting,
    openCreateForm,
    openEditForm,
    closeForm,
    handleSubmit,
    handleDelete,
  } = useCategories();

  return (
    <div className='mx-auto max-w-lg space-y-4'>
      <div className='flex items-center gap-4'>
        <Link to={NAVIGATION_PAGE_LIST.settingsPage} className='p-1 hover:bg-gray-100 rounded'>
          <ArrowLeft className='w-5 h-5 text-gray-600' />
        </Link>
        <h1 className='text-2xl font-normal text-gray-700'>カテゴリ管理</h1>
        <button
          onClick={openCreateForm}
          className='flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-full hover:bg-gray-50 transition shadow-sm'
        >
          <Plus className='w-5 h-5' />
          <span>作成</span>
        </button>
      </div>

      <div className='bg-white rounded-lg shadow'>
        <CategoryList categories={categories} isLoading={isLoading} isDeleting={isDeleting} onEdit={openEditForm} onDelete={handleDelete} />
      </div>

      <CategoryForm category={editingCategory} isOpen={isFormOpen} isSaving={isSaving} onClose={closeForm} onSubmit={handleSubmit} />
    </div>
  );
}
