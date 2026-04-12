import React from 'react';

interface FigmaHeaderCalendarProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

const FigmaHeaderCalendar: React.FC<FigmaHeaderCalendarProps> = ({ selectedDate, onDateChange }) => {
  // 오늘을 기준으로 과거 7일간의 고정 배열 생성
  const days = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0); // 시간 값 초기화

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

  return (
    <div className="flex items-center gap-1 px-4 py-1">
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
              flex flex-col items-center justify-center min-w-[50px] h-[72px] transition-all duration-300
              ${active ? 'border-[1.5px] border-slate-900 rounded-full' : 'hover:bg-slate-50 rounded-2xl'}
            `}
          >
            <span 
              className={`text-[11px] font-bold mb-1 ${isSun ? 'text-rose-500' : isSat ? 'text-blue-500' : 'text-slate-400'}`}
            >
              {daysOfWeek[day]}
            </span>
            <span 
              className={`text-[18px] font-black ${isSun ? 'text-rose-600' : isSat ? 'text-blue-600' : active ? 'text-slate-900' : 'text-slate-700'}`}
            >
              {date.getDate()}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default FigmaHeaderCalendar;
