import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import WeeklyCalendar from './WeeklyCalendar';
import MonthlyCalendar from './MonthlyCalendar';

interface UnifiedDateControllerProps {
  publisherDate: Date;
  popularDate: Date;
  onPublisherDateChange: (date: Date) => void;
  onPopularDateChange: (date: Date) => void;
}

const UnifiedDateController: React.FC<UnifiedDateControllerProps> = ({
  publisherDate,
  popularDate,
  onPublisherDateChange,
  onPopularDateChange
}) => {
  const [calendarMode, setCalendarMode] = useState<'weekly' | 'monthly'>('weekly');
  const [activeTarget, setActiveTarget] = useState<'all' | 'publisher' | 'popular'>('all');

  const handleDateChange = (date: Date) => {
    if (activeTarget === 'all' || activeTarget === 'publisher') {
      onPublisherDateChange(date);
    }
    if (activeTarget === 'all' || activeTarget === 'popular') {
      onPopularDateChange(date);
    }
  };

  return (
    <div className="max-w-[1280px] mx-auto px-6 mb-6">
      <div className="bg-white/80 backdrop-blur-md rounded-[32px] p-4 shadow-sm border border-slate-200/60 overflow-hidden">
        {/* 상단 컨트롤러 레이어 */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-3 px-2">
          <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-full border border-slate-200/50 shadow-inner">
            <button 
              onClick={() => setActiveTarget('all')}
              className={`px-4 py-1.5 rounded-full text-[13px] font-bold transition-all ${activeTarget === 'all' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              전체 적용
            </button>
            <button 
              onClick={() => setActiveTarget('publisher')}
              className={`px-4 py-1.5 rounded-full text-[13px] font-bold transition-all flex items-center gap-1.5 ${activeTarget === 'publisher' ? 'bg-white text-[#00BCD4] shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <div className="size-2 rounded-full bg-[#00BCD4]" />
              언론사별
            </button>
            <button 
              onClick={() => setActiveTarget('popular')}
              className={`px-4 py-1.5 rounded-full text-[13px] font-bold transition-all flex items-center gap-1.5 ${activeTarget === 'popular' ? 'bg-white text-[#FF5722] shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <div className="size-2 rounded-full bg-[#FF5722]" />
              통합이슈
            </button>
          </div>

          <div className="flex items-center gap-6">
             <div className="flex flex-col items-end">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Current Focus</span>
                <span className="text-[14px] font-black text-slate-700 tracking-tighter">
                  {activeTarget === 'all' ? '페이지 전체 제어 중' : activeTarget === 'publisher' ? '언론사 섹션 전용' : '통합 이슈 전용'}
                </span>
             </div>
          </div>
        </div>

        {/* 달력 컨텐츠 영역 */}
        <motion.div 
          layout 
          transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
          className="overflow-visible"
        >
          <AnimatePresence mode="wait">
            {calendarMode === 'weekly' ? (
              <motion.div 
                key="weekly"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.3 }}
              >
                <WeeklyCalendar 
                   publisherDate={publisherDate}
                   popularDate={popularDate}
                   onDateChange={handleDateChange}
                   onToggleMode={() => setCalendarMode('monthly')}
                   activeTarget={activeTarget}
                />
              </motion.div>
            ) : (
              <motion.div 
                key="monthly"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.3 }}
              >
                <MonthlyCalendar 
                   publisherDate={publisherDate}
                   popularDate={popularDate}
                   onDateChange={handleDateChange}
                   onToggleMode={() => setCalendarMode('weekly')}
                   activeTarget={activeTarget}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default UnifiedDateController;
