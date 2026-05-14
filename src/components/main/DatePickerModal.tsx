import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';

interface DatePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: Date;
  onConfirm: (date: Date) => void;
  mode?: 'year' | 'month' | 'day' | 'all';
  isDropdown?: boolean;
}

const DatePickerModal: React.FC<DatePickerModalProps> = ({ 
  isOpen, 
  onClose, 
  selectedDate, 
  onConfirm, 
  mode = 'all',
  isDropdown = false
}) => {
  const [tempYear, setTempYear] = useState(selectedDate.getFullYear());
  const [tempMonth, setTempMonth] = useState(selectedDate.getMonth() + 1);
  const [tempDay, setTempDay] = useState(selectedDate.getDate());

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear - 5 + i);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  
  const getDaysInMonth = (year: number, month: number) => new Date(year, month, 0).getDate();
  const days = Array.from({ length: getDaysInMonth(tempYear, tempMonth) }, (_, i) => i + 1);

  useEffect(() => {
    if (isOpen) {
      setTempYear(selectedDate.getFullYear());
      setTempMonth(selectedDate.getMonth() + 1);
      setTempDay(selectedDate.getDate());
      if (!isDropdown) document.body.style.overflow = 'hidden';
    } else {
      if (!isDropdown) document.body.style.overflow = 'unset';
    }
  }, [isOpen, selectedDate, isDropdown]);

  const handleConfirm = () => {
    const newDate = new Date(tempYear, tempMonth - 1, tempDay);
    onConfirm(newDate);
    onClose();
  };

  const Wheel = ({ 
    items, 
    value, 
    onChange, 
    unit 
  }: { 
    items: number[], 
    value: number, 
    onChange: (val: number) => void, 
    unit: string 
  }) => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      if (containerRef.current) {
        const activeItem = containerRef.current.querySelector(`[data-value="${value}"]`);
        if (activeItem) {
          activeItem.scrollIntoView({ behavior: 'auto', block: 'center' });
        }
      }
    }, [isOpen, value]);

    return (
      <div 
        ref={containerRef}
        className={`relative ${isDropdown ? 'h-32' : 'h-48'} w-full overflow-y-auto no-scrollbar snap-y snap-mandatory flex flex-col items-center`}
      >
        {/* Spacer for top */}
        <div className={isDropdown ? 'h-12 shrink-0' : 'h-20 shrink-0'} />
        {items.map((item) => (
          <div
            key={item}
            data-value={item}
            onClick={() => onChange(item)}
            className={`flex items-center justify-center shrink-0 snap-center cursor-pointer transition-all duration-200 w-full ${
              isDropdown ? 'h-8' : 'h-10'
            } ${
              value === item 
                ? 'text-slate-900 font-bold' + (isDropdown ? ' text-lg' : ' text-xl')
                : 'text-slate-300 font-medium opacity-50 hover:opacity-100' + (isDropdown ? ' text-base' : ' text-lg')
            }`}
          >
            {item}{unit}
          </div>
        ))}
        {/* Spacer for bottom */}
        <div className={isDropdown ? 'h-12 shrink-0' : 'h-20 shrink-0'} />
      </div>
    );
  };

  const getTitle = () => {
    switch (mode) {
      case 'year': return '연도';
      case 'month': return '월';
      case 'day': return '일';
      default: return '날짜';
    }
  };

  const dropdownContent = (
    <div className={`flex flex-col bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden ${mode === 'all' ? 'w-[280px]' : 'w-[120px]'}`}>
      {/* Mini Title */}
      <div className="px-3 pt-3 pb-1 text-center border-b border-slate-50">
        <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">{getTitle()} 선택</span>
      </div>

      <div className="relative flex items-center justify-center px-2 py-2">
        <div className="absolute left-2 right-2 h-8 bg-primary/5 rounded-lg pointer-events-none top-1/2 -translate-y-1/2 border border-primary/10" />
        <div className="flex w-full">
          {(mode === 'year' || mode === 'all') && <Wheel items={years} value={tempYear} onChange={setTempYear} unit="" />}
          {(mode === 'month' || mode === 'all') && <Wheel items={months} value={tempMonth} onChange={setTempMonth} unit="" />}
          {(mode === 'day' || mode === 'all') && <Wheel items={days} value={tempDay} onChange={setTempDay} unit="" />}
        </div>
      </div>

      <div className="flex border-t border-slate-100">
        <button onClick={onClose} className="flex-1 py-2 text-slate-400 text-xs font-bold hover:bg-slate-50 transition-colors">취소</button>
        <button onClick={handleConfirm} className="flex-1 py-2 bg-primary text-white text-xs font-bold hover:bg-primary-dark transition-colors">확인</button>
      </div>
    </div>
  );

  const modalContent = (
    <div className="fixed inset-0 z-[10001] flex items-center justify-center p-6 pointer-events-none">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm pointer-events-auto" 
      />
      
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className={`relative w-full ${mode === 'all' ? 'max-w-[360px]' : 'max-w-[280px]'} bg-white rounded-[32px] shadow-2xl overflow-hidden flex flex-col pointer-events-auto`}
      >
        <div className="px-6 pt-8 pb-4 text-center">
          <h3 className="text-slate-800 text-lg font-bold">{getTitle()} 선택</h3>
          <p className="text-slate-400 text-sm mt-1">{tempYear}년 {tempMonth}월 {tempDay}일</p>
        </div>

        <div className="relative flex items-center justify-center px-4 py-4">
          <div className="absolute left-4 right-4 h-10 bg-slate-100 rounded-xl pointer-events-none top-1/2 -translate-y-1/2" />
          <div className="flex w-full">
            {(mode === 'year' || mode === 'all') && <Wheel items={years} value={tempYear} onChange={setTempYear} unit="년" />}
            {(mode === 'month' || mode === 'all') && <Wheel items={months} value={tempMonth} onChange={setTempMonth} unit="월" />}
            {(mode === 'day' || mode === 'all') && <Wheel items={days} value={tempDay} onChange={setTempDay} unit="일" />}
          </div>
        </div>

        <div className="flex border-t border-slate-100">
          <button onClick={onClose} className="flex-1 py-4 text-slate-500 font-bold hover:bg-slate-50 transition-colors">취소</button>
          <button onClick={handleConfirm} className="flex-1 py-4 bg-emerald-500 text-white font-bold hover:bg-emerald-600 transition-colors">확인</button>
        </div>
      </motion.div>
    </div>
  );

  return isDropdown ? dropdownContent : createPortal(modalContent, document.body);
};

export default DatePickerModal;
