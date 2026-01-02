import { ChevronLeft, ChevronRight } from "lucide-react";
import type { CalendarDay } from "../../hooks/useCalendar";

type Props = {
  currentMonthLabel: string;
  calendarDays: CalendarDay[];
  onPreviousMonth: () => void;
  onNextMonth: () => void;
  onGoToToday: () => void;
  onDateClick?: (dateString: string) => void;
};

const WEEKDAY_LABELS = ["日", "月", "火", "水", "木", "金", "土"];

const formatCompactAmount = (amount: number) => {
  if (amount >= 10000) {
    return `${Math.floor(amount / 10000)}万`;
  }
  if (amount >= 1000) {
    return `${Math.floor(amount / 1000)}千`;
  }
  return amount.toString();
};

const WEEKDAY_NAMES = ["日曜日", "月曜日", "火曜日", "水曜日", "木曜日", "金曜日", "土曜日"];

const getTodayLabel = () => {
  const today = new Date();
  const month = today.getMonth() + 1;
  const date = today.getDate();
  const dayOfWeek = WEEKDAY_NAMES[today.getDay()];
  return `${month}月${date}日 (${dayOfWeek})`;
};

export function Calendar({ currentMonthLabel, calendarDays, onPreviousMonth, onNextMonth, onGoToToday, onDateClick }: Props) {
  return (
    <div className='bg-white rounded-lg shadow'>
      {/* Header */}
      <div className='flex items-center justify-between p-4 border-b'>
        <button onClick={onPreviousMonth} className='p-2 hover:bg-gray-100 rounded-full transition' aria-label='前月'>
          <ChevronLeft className='w-5 h-5' />
        </button>
        <div className='flex items-center gap-3'>
          <h2 className='text-lg font-semibold'>{currentMonthLabel}</h2>
          <div className='relative group'>
            <button
              onClick={onGoToToday}
              className='px-5 py-1.5 text-sm bg-white text-gray-500 border border-gray-300 rounded-full hover:bg-gray-50 transition cursor-pointer'
            >
              今日
            </button>
            <div className='absolute left-1/2 -translate-x-1/2 top-full mt-2 px-3 py-1.5 bg-gray-600 text-white text-sm rounded-full whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity'>
              {getTodayLabel()}
            </div>
          </div>
        </div>
        <button onClick={onNextMonth} className='p-2 hover:bg-gray-100 rounded-full transition' aria-label='次月'>
          <ChevronRight className='w-5 h-5' />
        </button>
      </div>

      {/* Weekday headers */}
      <div className='grid grid-cols-7 border-b'>
        {WEEKDAY_LABELS.map((label, index) => (
          <div
            key={label}
            className={`py-2 text-center text-sm font-medium ${index === 0 ? "text-red-500" : index === 6 ? "text-blue-500" : "text-gray-600"}`}
          >
            {label}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className='grid grid-cols-7'>
        {calendarDays.map((day, index) => {
          const dayOfWeek = day.date.getDay();
          const hasIncome = day.dailyAmount.income > 0;
          const hasExpense = day.dailyAmount.expense > 0;
          const hasBoth = hasIncome && hasExpense;

          return (
            <button
              key={day.dateString}
              onClick={() => onDateClick?.(day.dateString)}
              className={`
                min-h-20 p-1 border-b border-r transition hover:bg-gray-50 flex flex-col
                ${index % 7 === 6 ? "border-r-0" : ""}
                ${!day.isCurrentMonth ? "bg-gray-50" : ""}
              `}
            >
              <span
                className={`
                  inline-flex items-center justify-center w-6 h-6 text-sm rounded-full
                  ${day.isToday ? "bg-blue-600 text-white" : ""}
                  ${!day.isToday && !day.isCurrentMonth ? "text-gray-400" : ""}
                  ${!day.isToday && day.isCurrentMonth && dayOfWeek === 0 ? "text-red-500" : ""}
                  ${!day.isToday && day.isCurrentMonth && dayOfWeek === 6 ? "text-blue-500" : ""}
                `}
              >
                {day.date.getDate()}
              </span>
              {day.isCurrentMonth && (hasIncome || hasExpense) && (
                <div
                  className={`my-auto sm:my-0 self-center space-y-0.5 text-[10px] sm:text-sm leading-tight ${hasBoth ? "sm:-mt-1 sm:space-y-0" : "sm:mt-1"}`}
                >
                  {hasIncome && <div className='text-green-600 whitespace-nowrap'>+{formatCompactAmount(day.dailyAmount.income)}</div>}
                  {hasExpense && <div className='text-red-600 whitespace-nowrap'>-{formatCompactAmount(day.dailyAmount.expense)}</div>}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
