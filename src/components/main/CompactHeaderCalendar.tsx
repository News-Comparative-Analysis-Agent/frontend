import React, { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

interface CompactHeaderCalendarProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  isWhite?: boolean;
}

const CompactHeaderCalendar: React.FC<CompactHeaderCalendarProps> = ({ selectedDate, onDateChange, isWhite = false }) => {
  const [activePicker, setActivePicker] = useState<'year' | 'month' | 'day' | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const year = selectedDate.getFullYear();
  const month = selectedDate.getMonth() + 1;
  const day = selectedDate.getDate();

  // [페이지 스크롤 제어 및 외부 클릭 감지]
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setActivePicker(null);
      }
    };

    if (activePicker) {
      document.addEventListener('mousedown', handleClickOutside);
      // 피커가 열려있을 때 페이지 스크롤 방지
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [activePicker]);

  const handleValueChange = (mode: 'year' | 'month' | 'day', value: number) => {
    const newDate = new Date(selectedDate);
    if (mode === 'year') newDate.setFullYear(value);
    if (mode === 'month') newDate.setMonth(value - 1);
    if (mode === 'day') newDate.setDate(value);
    onDateChange(newDate);
    setActivePicker(null);
  };

  const ExpandingBox = ({ 
    mode, 
    value, 
    label, 
    width, 
    items 
  }: { 
    mode: 'year' | 'month' | 'day', 
    value: number, 
    label: string, 
    width: string,
    items: number[]
  }) => {
    const isActive = activePicker === mode;
    const scrollRef = useRef<HTMLDivElement>(null);

    // [최초 개방 시에만 딱 한 번 실행되는 스크롤 이동]
    useEffect(() => {
      if (isActive && scrollRef.current) {
        const target = scrollRef.current;
        // 마이크로태스크 큐를 사용하여 렌더링 후 정교하게 위치 포착
        requestAnimationFrame(() => {
          const activeItem = target.querySelector(`[data-value="${value}"]`);
          if (activeItem) {
            activeItem.scrollIntoView({ behavior: 'auto', block: 'center' });
          }
        });
      }
    }, [isActive]); // 오직 isActive가 변경될 때만 실행 (열릴 때 1회)

    return (
      <div className="flex items-center gap-2">
        <div className={`relative ${width} h-[42px]`}>
          <motion.div 
            animate={{ 
              height: isActive ? 200 : 42,
              zIndex: isActive ? 100 : 1
            }}
            transition={{ type: 'spring', damping: 30, stiffness: 400 }}
            className={`
              absolute top-0 left-0 right-0 overflow-hidden rounded-lg transition-all border
              ${isWhite 
                ? (isActive ? 'bg-white shadow-md border-primary/30' : 'bg-white border-slate-200 text-slate-700 hover:border-primary/40 hover:bg-slate-50/50 shadow-sm') 
                : 'bg-slate-800 border-white/20 text-white'
              }
              cursor-pointer select-none
            `}
            onClick={() => !isActive && setActivePicker(mode)}
          >
            <div className={`h-[42px] flex items-center justify-center font-bold text-[16px] shrink-0 transition-colors duration-200 ${
              isActive ? 'text-primary font-black' : 'text-slate-700'
            }`}>
              {value}
            </div>

            {isActive && (
              <div 
                ref={scrollRef}
                className="h-[158px] overflow-y-auto no-scrollbar snap-y snap-mandatory flex flex-col items-center"
              >
                <div className="h-6 shrink-0" />
                {items.map((item) => (
                  <div
                    key={`${mode}-${item}`}
                    data-value={item}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleValueChange(mode, item);
                    }}
                    className={`h-8 flex items-center justify-center shrink-0 snap-center w-full transition-colors ${
                      value === item ? 'bg-primary/5 text-primary text-[17px] font-black' : 'text-slate-400 text-[14px] font-medium hover:text-slate-700 hover:bg-slate-50/50'
                    }`}
                  >
                    {item}
                  </div>
                ))}
                <div className="h-6 shrink-0" />
              </div>
            )}

            {isActive && (
              <>
                <div className={`absolute top-[42px] left-0 right-0 h-6 bg-gradient-to-b ${isWhite ? 'from-white via-white/80' : 'from-slate-800 via-slate-800/80'} to-transparent pointer-events-none z-10`} />
                <div className={`absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t ${isWhite ? 'from-white via-white/80' : 'from-slate-800 via-slate-800/80'} to-transparent pointer-events-none z-10`} />
              </>
            )}
          </motion.div>
        </div>
        
        <span className={`text-[14px] font-bold whitespace-nowrap shrink-0 ${isWhite ? 'text-slate-600' : 'text-white/70'}`}>
          {label}
        </span>
      </div>
    );
  };

  const currentYear = new Date().getFullYear();
  const years = [currentYear - 1, currentYear, currentYear + 1];
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const daysInMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0).getDate();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <div ref={containerRef} className={`flex items-start p-1 rounded-xl border transition-all w-[260px] justify-between ${
      isWhite ? 'bg-slate-100/50 border-slate-200 shadow-inner' : 'bg-white/10 border-white/10'
    }`}>
      <div className="flex items-center justify-between w-full px-1">
        <ExpandingBox mode="year" value={year} label="년" width="w-[64px]" items={years} />
        <ExpandingBox mode="month" value={month} label="월" width="w-[44px]" items={months} />
        <ExpandingBox mode="day" value={day} label="일" width="w-[44px]" items={days} />
      </div>
    </div>
  );
};

export default React.memo(CompactHeaderCalendar);
