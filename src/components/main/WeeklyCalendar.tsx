import React from 'react';

interface WeeklyCalendarProps {
  publisherDate: Date;
  popularDate: Date;
  onDateChange: (date: Date) => void;
  onToggleMode: () => void;
  activeTarget: 'all' | 'publisher' | 'popular';
}

const WeeklyCalendar: React.FC<WeeklyCalendarProps> = ({ 
  publisherDate, popularDate, onDateChange, onToggleMode, activeTarget 
}) => {
  // Generate current week (7 days centered around publisherDate or popularDate)
  // Use popularDate as base for current view or publisherDate
  const baseDate = new Date(popularDate);
  const days = [];
  const today = new Date();
  
  for (let i = -3; i <= 3; i++) {
    const date = new Date(baseDate);
    date.setDate(baseDate.getDate() + i);
    days.push(date);
  }

  const daysOfWeek = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  const isSameDay = (d1: Date, d2: Date) =>
    d1.getDate() === d2.getDate() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getFullYear() === d2.getFullYear();

  return (
    <div className="w-full py-3 px-2 flex flex-col items-center">
      <div className="w-full flex items-center justify-between gap-1 overflow-visible">
        <div className="flex flex-1 items-center justify-between gap-0">
          {days.map((date, idx) => {
            const isPub = isSameDay(date, publisherDate);
            const isPop = isSameDay(date, popularDate);
            const isTodayDate = isSameDay(date, today);
            
            // activeTarget에 따라 현재 강조할 스타일 결정
            const isMainActive = (activeTarget === 'publisher' && isPub) || 
                               (activeTarget === 'popular' && isPop) ||
                               (activeTarget === 'all' && (isPub || isPop));

            return (
              <button
                key={idx}
                onClick={() => onDateChange(date)}
                className="flex-1 flex flex-col items-center group relative pb-1"
              >
                <span className={`text-[11px] font-bold mb-2 transition-colors ${(isPub || isPop) ? 'text-slate-800' : 'text-slate-400'}`}>
                  {daysOfWeek[date.getDay()]}
                </span>
                <div 
                  className={`
                    w-10 h-10 flex items-center justify-center rounded-full text-[15px] font-bold transition-all duration-300 relative
                    ${isPop ? 'bg-[#FF5722] text-white shadow-[0_6px_16px_rgba(255,87,34,0.3)] scale-105 z-10' : 
                      isPub ? 'bg-[#00BCD4] text-white shadow-[0_6px_16px_rgba(0,188,212,0.3)]' : 
                      'text-slate-600 hover:bg-slate-200/50'}
                  `}
                >
                  {date.getDate()}
                  
                  {/* 통합 인디케이터: 두 날짜가 같으면 특별 표시, 다르면 각각 표시 */}
                  {isPop && (
                    <div className={`absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-2 h-0.5 ${isPub ? 'bg-white' : 'bg-[#00BCD4]'} rounded-full`} title="통합 이슈 날짜" />
                  )}
                  {isPub && !isPop && (
                    <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-2 h-0.5 bg-[#00BCD4] rounded-full" title="언론사 뉴스 날짜" />
                  )}

                  {isTodayDate && !(isPub || isPop) && (
                    <div className="absolute -top-1 right-1 w-1.5 h-1.5 bg-slate-300 rounded-full" />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        <button 
          onClick={onToggleMode}
          className="w-10 h-10 min-w-[40px] mt-5 ml-1 flex items-center justify-center rounded-full bg-white/80 text-slate-400 hover:bg-white hover:text-primary transition-all border border-slate-200/50 shadow-sm"
          title="월간 달력 보기"
        >
          <span className="material-symbols-outlined text-[18px]">calendar_month</span>
        </button>
      </div>
    </div>
  );
};

export default WeeklyCalendar;
