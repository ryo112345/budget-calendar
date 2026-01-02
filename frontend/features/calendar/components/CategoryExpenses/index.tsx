type CategoryExpense = {
  categoryId: number;
  categoryName: string;
  amount: number;
  budget?: number;
};

type Props = {
  expenses: CategoryExpense[];
};

export function CategoryExpenses({ expenses }: Props) {
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("ja-JP").format(amount);
  };

  if (expenses.length === 0) {
    return (
      <div className='bg-white rounded-lg shadow p-4'>
        <h3 className='text-sm font-medium text-gray-600 mb-3'>カテゴリ別支出</h3>
        <p className='text-gray-500 text-sm'>支出がありません</p>
      </div>
    );
  }

  return (
    <div className='bg-white rounded-lg shadow p-4'>
      <h3 className='text-sm font-medium text-gray-600 mb-3'>カテゴリ別支出</h3>
      <div className='space-y-3 px-4'>
        {expenses.map((expense) => {
          const hasBudget = expense.budget !== undefined && expense.budget > 0;
          const percentage = hasBudget ? (expense.amount / expense.budget!) * 100 : 0;
          const isOverBudget = percentage > 100;

          return (
            <div key={expense.categoryId}>
              <div className='flex flex-wrap text-sm gap-x-2'>
                <span className='text-gray-700 shrink-0'>{expense.categoryName}</span>
                <span className='font-medium ml-auto whitespace-nowrap'>
                  <span className='text-gray-900'>{formatAmount(expense.amount)}</span>
                  <span className='text-gray-400'> / {hasBudget ? formatAmount(expense.budget!) : "--"}</span>
                </span>
              </div>
              {hasBudget ? (
                <div className='mt-1 h-2 bg-gray-100 rounded-full overflow-hidden'>
                  <div
                    className={`h-full rounded-full ${isOverBudget ? "bg-red-500" : "bg-blue-400"}`}
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                  />
                </div>
              ) : (
                <p className='text-xs text-gray-400 mt-1'>予算未設定</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export type { CategoryExpense };
