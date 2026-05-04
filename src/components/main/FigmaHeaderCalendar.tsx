import React from 'react';

interface FigmaHeaderCalendarProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

const FigmaHeaderCalendar: React.FC<FigmaHeaderCalendarProps> = ({ selectedDate, onDateChange }) => {
  const days = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    days.push(date);
  }

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const isSameDay = (d1: Date, d2: Date) =>
    d1.getDate() === d2.getDate() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getFullYear() === d2.getFullYear();

  const currentMonth = selectedDate.getMonth() + 1;

  return (
    <div className="flex items-center justify-end gap-x-2 xl:gap-x-4 w-full py-0.1">
      {/* 월 표시 영역 - 해상도별 크기 조정 */}
      <div className="flex flex-col items-center justify-center pr-4 xl:pr-8 shrink-0 border-r border-slate-200">
        <span className="text-[32px] xl:text-[48px] font-bold text-slate-800 leading-none tracking-tighter">{currentMonth}</span>
        <span className="text-[7px] xl:text-[8px] font-bold text-slate-400 mt-0 uppercase tracking-[0.2em]">Month</span>
      </div>

      <div className="flex items-center justify-center gap-x-[6px] xl:gap-x-[11px]">
        {days.map((date, idx) => {
          const active = isSameDay(date, selectedDate);
          const day = date.getDay();
          const isSun = day === 0;
          const isSat = day === 6;
          
          return (
            <div key={idx} className="flex-1 flex justify-center">
              <button
                onClick={() => onDateChange(date)}
                className={`
                  flex flex-col items-center justify-center w-[36px] h-[54px] xl:w-[48px] xl:h-[72px] transition-all duration-300
                  ${active ? 'bg-primary/5 border-[1.5px] border-primary/30 rounded-2xl' : 'hover:bg-slate-50 rounded-2xl'}
                `}
              >
                <span 
                  className={`text-[9px] xl:text-[11px] font-semibold mb-1 ${active ? 'text-primary' : isSun ? 'text-rose-500' : isSat ? 'text-blue-500' : 'text-slate-400'}`}
                >
                  {daysOfWeek[day]}
                </span>
                <span 
                  className={`text-[14px] xl:text-[18px] font-bold ${active ? 'text-primary' : isSun ? 'text-rose-600' : isSat ? 'text-blue-600' : 'text-slate-700'}`}
                >
                  {date.getDate()}
                </span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FigmaHeaderCalendar;
