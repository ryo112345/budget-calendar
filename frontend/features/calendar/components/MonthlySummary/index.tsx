type Props = {
  income: number;
  expense: number;
  budget: number;
  budgetRemaining?: number;
};

export function MonthlySummary({ income, expense, budget, budgetRemaining }: Props) {
  const balance = income - expense;

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("ja-JP").format(amount);
  };

  return (
    <div className='space-y-4'>
      {/* 収支カード */}
      <div className='bg-white rounded-lg shadow p-4'>
        <h3 className='text-sm font-medium text-gray-600 mb-3'>今月の収支</h3>
        <div className='space-y-2 px-4'>
          <div className='flex justify-between items-center'>
            <span className='text-gray-600'>収入</span>
            <span className='text-green-600 font-medium'>+{formatAmount(income)}</span>
          </div>
          <div className='flex justify-between items-center'>
            <span className='text-gray-600'>支出</span>
            <span className='text-red-600 font-medium'>-{formatAmount(expense)}</span>
          </div>
          <div className='border-t pt-2 flex justify-between items-center'>
            <span className='text-gray-800 font-medium'>収支</span>
            <span className={`font-bold ${balance >= 0 ? "text-green-600" : "text-red-600"}`}>
              {balance >= 0 ? "+" : ""}
              {formatAmount(balance)}
            </span>
          </div>
        </div>
      </div>

      {/* 予算カード */}
      {budget > 0 && (
        <div className='bg-white rounded-lg shadow p-4'>
          <h3 className='text-sm font-medium text-gray-600 mb-3'>今月の予算</h3>
          <div className='space-y-2 px-4'>
            <div className='flex justify-between items-center'>
              <span className='text-gray-600'>予算</span>
              <span className='font-medium text-gray-800'>{formatAmount(budget)}</span>
            </div>
            <div className='flex justify-between items-center'>
              <span className='text-gray-600'>支出</span>
              <span className='text-red-600 font-medium'>-{formatAmount(expense)}</span>
            </div>
            <div className='border-t pt-2 flex justify-between items-center'>
              <span className='text-gray-800 font-medium'>残り</span>
              <span className={`font-bold ${budgetRemaining !== undefined && budgetRemaining >= 0 ? "text-blue-600" : "text-red-600"}`}>
                {formatAmount(budgetRemaining ?? 0)}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
