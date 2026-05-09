import React from 'react';

interface CompactHeaderCalendarProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  isWhite?: boolean;
}

const CompactHeaderCalendar: React.FC<CompactHeaderCalendarProps> = ({ selectedDate, onDateChange, isWhite = false }) => {
  const days = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    days.push(date);
  }

  const daysOfWeek = ['일', '월', '화', '수', '목', '금', '토'];

  const isSameDay = (d1: Date, d2: Date) =>
    d1.getDate() === d2.getDate() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getFullYear() === d2.getFullYear();

  const currentMonth = selectedDate.getMonth() + 1;

  return (
    <div className={`flex items-center p-1.5 rounded-2xl border ${
      isWhite ? 'bg-slate-100/50 border-slate-200' : 'bg-white/10 border-white/10'
    }`}>
      {/* 월(Month) 표시 영역 */}
      <div className={`flex flex-col items-center justify-center pl-3 pr-4 mr-1.5 border-r ${isWhite ? 'border-slate-300/50' : 'border-white/20'}`}>
        <span className={`text-[22px] lg:text-[28px] font-extrabold leading-none tracking-tight ${isWhite ? 'text-slate-800' : 'text-white'}`}>
          {currentMonth}
        </span>
        <span className={`text-[9px] lg:text-[10px] font-bold tracking-[0.1em] mt-0.5 ${isWhite ? 'text-slate-500' : 'text-white/60'}`}>
          월
        </span>
      </div>

      <div className="flex gap-0.5 lg:gap-1">
        {days.map((date, idx) => {
          const active = isSameDay(date, selectedDate);
          const day = date.getDay();
          const isSun = day === 0;
          const isSat = day === 6;
          
          return (
            <button
              key={idx}
              onClick={() => onDateChange(date)}
              className={`
                flex flex-col items-center justify-center w-[36px] h-[46px] lg:w-[46px] lg:h-[56px] rounded-xl transition-all
                ${active 
                  ? (isWhite ? 'bg-white shadow-sm border border-slate-200 text-primary' : 'bg-white shadow-sm border border-white/20 text-primary scale-105')
                  : (isWhite ? 'hover:bg-white/50 text-slate-500' : 'hover:bg-white/10 text-white/60')
                }
              `}
            >
              <span className={`text-[10px] lg:text-[11px] font-medium leading-none mb-1 ${
                active ? (isWhite ? 'text-primary' : 'text-primary') : 
                isSun ? (isWhite ? 'text-rose-500' : 'text-rose-400') : 
                isSat ? (isWhite ? 'text-blue-500' : 'text-blue-400') : 
                (isWhite ? 'text-slate-400' : 'text-white/60')
              }`}>
                {daysOfWeek[day]}
              </span>
              <span className={`text-[14px] lg:text-[18px] font-bold leading-none ${
                active ? (isWhite ? 'text-slate-900' : 'text-primary') : 
                (isWhite ? 'text-slate-700' : 'text-white/80')
              }`}>
                {date.getDate()}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CompactHeaderCalendar;
