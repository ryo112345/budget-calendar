import { Link } from "react-router";
import { ArrowLeft, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { NAVIGATION_PAGE_LIST } from "~/app/routes";
import { BudgetList } from "~/features/settings/components/BudgetList";
import { BudgetForm } from "~/features/settings/components/BudgetForm";
import { useBudgets } from "~/features/settings/hooks/useBudgets";

export default function BudgetPage() {
  const {
    budgets,
    totalBudget,
    currentMonthLabel,
    editingBudget,
    isFormOpen,
    isSaving,
    isDeleting,
    goToPreviousMonth,
    goToNextMonth,
    openCreateForm,
    openEditForm,
    closeForm,
    handleSubmit,
    handleDelete,
  } = useBudgets();

  const existingCategoryIds = budgets.map((b) => b.category_id);

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("ja-JP").format(amount);
  };

  return (
    <div className='mx-auto max-w-lg space-y-4'>
      <div className='flex items-center gap-4'>
        <Link to={NAVIGATION_PAGE_LIST.settingsPage} className='p-1 hover:bg-gray-100 rounded'>
          <ArrowLeft className='w-5 h-5 text-gray-600' />
        </Link>
        <h1 className='text-2xl font-normal text-gray-700'>予算設定</h1>
        <button
          onClick={openCreateForm}
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

      {/* Total budget */}
      <div className='bg-white rounded-lg shadow p-4'>
        <div className='flex items-center justify-between'>
          <span className='text-gray-600'>合計予算</span>
          <span className='text-xl font-bold text-gray-800'>{formatAmount(totalBudget)}円</span>
        </div>
      </div>

      {/* Budget list */}
      <div className='bg-white rounded-lg shadow'>
        <BudgetList budgets={budgets} isDeleting={isDeleting} onEdit={openEditForm} onDelete={handleDelete} />
      </div>

      <BudgetForm
        budget={editingBudget}
        isOpen={isFormOpen}
        isSaving={isSaving}
        existingCategoryIds={existingCategoryIds}
        onClose={closeForm}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
