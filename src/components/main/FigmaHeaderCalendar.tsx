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

  const currentMonth = selectedDate.getMonth() + 1;

  return (
    <div className="flex items-center justify-end gap-x-4 w-full py-0.1">
      {/* 🗓 월 표시 영역 (대폭 확대 및 정렬 수정) */}
      <div className="flex flex-col items-center justify-center pr-8 shrink-0 border-r border-slate-200">
        <span className="text-[48px] font-black text-slate-800 leading-none tracking-tighter">{currentMonth}</span>
        <span className="text-[8px] font-black text-slate-400 mt-0 uppercase tracking-[0.2em] -mr-0.5">Month</span>
      </div>

      <div className="flex items-center justify-center gap-x-2">
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
                  flex flex-col items-center justify-center w-[48px] h-[72px] transition-all duration-300
                  ${active ? 'bg-primary/5 border-[1.5px] border-primary/30 rounded-2xl' : 'hover:bg-slate-50 rounded-2xl'}
                `}
              >
                <span 
                  className={`text-[11px] font-bold mb-1 ${active ? 'text-primary' : isSun ? 'text-rose-500' : isSat ? 'text-blue-500' : 'text-slate-400'}`}
                >
                  {daysOfWeek[day]}
                </span>
                <span 
                  className={`text-[18px] font-black ${active ? 'text-primary' : isSun ? 'text-rose-600' : isSat ? 'text-blue-600' : 'text-slate-700'}`}
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
