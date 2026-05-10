import React, { useEffect, useState } from 'react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  duration?: number;
  onClose: () => void;
}

/**
 * 프리미엄 디자인의 토스트 알림 컴포넌트
 * - Glassmorphism 스타일 적용
 * - 부드러운 Slide-up 및 Fade-in 애니메이션
 */
const Toast = ({ message, type = 'success', duration = 3000, onClose }: ToastProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // 마운트 후 애니메이션 시작
    const showTimer = setTimeout(() => setIsVisible(true), 10);
    
    // 지정된 시간 후 닫기 애니메이션 시작
    const hideTimer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 500); // 애니메이션 완료 후 완전히 제거
    }, duration);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
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
    <div 
      className={`fixed bottom-24 left-1/2 -translate-x-1/2 z-[200] transition-all duration-500 ease-out transform ${
        isVisible 
          ? 'translate-y-0 opacity-100 scale-100' 
          : 'translate-y-10 opacity-0 scale-90'
      }`}
    >
      <div className={`${colors[type]} backdrop-blur-md px-6 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 border border-white/20 min-w-[300px]`}>
        <span className="material-symbols-outlined text-[20px]">
          {icons[type]}
        </span>
        <span className="text-[14px] font-bold tracking-tight">
          {message}
        </span>
      </div>
    </div>
  );
};

export default Toast;
