import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  duration?: number;
  onClose: () => void;
}

/**
 * 프리미엄 디자인의 토스트 알림 컴포넌트 (Framer Motion 적용)
 * - Glassmorphism 스타일 적용
 * - 부드러운 Slide-up 및 Fade-out 애니메이션
 */
const Toast = ({ message, type = 'success', duration = 3000, onClose }: ToastProps) => {
  useEffect(() => {
    const hideTimer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(hideTimer);
  }, [duration, onClose]);

  const icons = {
    success: 'check_circle',
    error: 'error',
    info: 'info'
  };

  const colors = {
    success: 'bg-emerald-500/90 text-white shadow-emerald-500/20',
    error: 'bg-rose-500/90 text-white shadow-rose-500/20',
    info: 'bg-slate-800/90 text-white shadow-slate-900/20'
  };

  return (
    <motion.div 
      initial={{ y: 20, opacity: 0, scale: 0.9, x: '-50%' }}
      animate={{ y: 0, opacity: 1, scale: 1, x: '-50%' }}
      exit={{ y: 20, opacity: 0, scale: 0.9, x: '-50%' }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className="fixed bottom-24 left-1/2 z-[200] transform"
    >
      <div className={`${colors[type]} backdrop-blur-md px-6 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 border border-white/20 min-w-[300px]`}>
        <span className="material-symbols-outlined text-[20px]">
          {icons[type]}
        </span>
        <span className="text-[14px] font-bold tracking-tight text-white">
          {message}
        </span>
      </div>
    </motion.div>
  );
};

export default Toast;
