import React, { useState } from 'react';

interface MonthlyCalendarProps {
  publisherDate: Date;
  popularDate: Date;
  onDateChange: (date: Date) => void;
  onToggleMode: () => void;
  activeTarget: 'all' | 'publisher' | 'popular';
}

const MonthlyCalendar: React.FC<MonthlyCalendarProps> = ({ 
  publisherDate, popularDate, onDateChange, onToggleMode, activeTarget 
}) => {
  const [viewDate, setViewDate] = useState(new Date(popularDate));

  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const days = [];
  const totalDays = daysInMonth(year, month);
  const offset = firstDayOfMonth(year, month);

  // Prev month filler
  const prevMonthTotalDays = daysInMonth(year, month - 1);
  for (let i = offset - 1; i >= 0; i--) {
    days.push({ day: prevMonthTotalDays - i, currentMonth: false });
  }

  // Current month
  for (let i = 1; i <= totalDays; i++) {
    days.push({ day: i, currentMonth: true });
  }

  // Next month filler
  const remainingCells = 42 - days.length;
  for (let i = 1; i <= remainingCells; i++) {
    days.push({ day: i, currentMonth: false });
  }

  const handlePrevMonth = () => setViewDate(new Date(year, month - 1, 1));
  const handleNextMonth = () => setViewDate(new Date(year, month + 1, 1));

  const isPublisherSelected = (day: number) => 
    publisherDate.getDate() === day && 
    publisherDate.getMonth() === month && 
    publisherDate.getFullYear() === year;

  const isPopularSelected = (day: number) => 
    popularDate.getDate() === day && 
    popularDate.getMonth() === month && 
    popularDate.getFullYear() === year;

  const isToday = (day: number) => {
    const today = new Date();
    return today.getDate() === day && today.getMonth() === month && today.getFullYear() === year;
  };

  return (
    <div className="bg-white rounded-3xl p-5 shadow-premium-card border border-slate-100 animate-in fade-in slide-in-from-top-2 duration-700">
      <div className="flex items-center justify-between mb-4 px-2">
        <h3 className="text-[16px] font-black text-slate-800 tracking-tight">
          {year}년 {month + 1}월
        </h3>
        <div className="flex gap-1">
          <button onClick={onToggleMode} className="size-8 flex items-center justify-center rounded-full hover:bg-slate-50 text-slate-400 transition-colors mr-1 border border-slate-100" title="주간 보기로 전환">
            <span className="material-symbols-outlined text-[18px]">view_week</span>
          </button>
          <button onClick={handlePrevMonth} className="size-8 flex items-center justify-center rounded-full hover:bg-slate-50 text-slate-400 transition-colors">
            <span className="material-symbols-outlined text-[18px]">chevron_left</span>
          </button>
          <button onClick={handleNextMonth} className="size-8 flex items-center justify-center rounded-full hover:bg-slate-50 text-slate-400 transition-colors">
            <span className="material-symbols-outlined text-[18px]">chevron_right</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center mb-4">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
          <span key={i} className="text-[11px] font-bold text-slate-400">
            {d}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1 place-items-center">
        {days.map((item, idx) => {
          const isPub = item.currentMonth && isPublisherSelected(item.day);
          const isPop = item.currentMonth && isPopularSelected(item.day);
          const today = item.currentMonth && isToday(item.day);
          
          return (
            <button
              key={idx}
              disabled={!item.currentMonth}
              onClick={() => item.currentMonth && onDateChange(new Date(year, month, item.day))}
              className={`
                w-10 h-10 flex items-center justify-center rounded-full text-[14px] font-bold transition-all relative group
                ${!item.currentMonth ? 'text-slate-200' : 'text-slate-600 hover:bg-slate-100'}
                ${isPop ? 'bg-[#FF5722] text-white shadow-[0_6px_16px_rgba(255,87,34,0.3)]' : 
                  isPub ? 'bg-[#00BCD4] text-white shadow-[0_6px_16px_rgba(0,188,212,0.3)]' : ''}
              `}
            >
              {item.day}
              {isPop && (
                <div className={`absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-2 h-0.5 ${isPub ? 'bg-white' : 'bg-[#00BCD4]'} rounded-full`} />
              )}
              {isPub && !isPop && (
                <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-2 h-0.5 bg-[#00BCD4] rounded-full" />
              )}
              {today && !(isPub || isPop) && (
                 <div className="absolute -top-0.5 right-0.5 w-1.5 h-1.5 bg-slate-300 rounded-full" />
              )}
            </button>
          );
        })}
      </div>

      {/* 하단 핸들바 (Handlebar) */}
      <div className="flex justify-center mt-6 mb-1">
        <div className="w-8 h-1 bg-slate-200 rounded-full opacity-50"></div>
      </div>
    </div>
  );
};

export default MonthlyCalendar;
