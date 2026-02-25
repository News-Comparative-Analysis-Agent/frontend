import React from 'react'

interface StickyDockProps {
  leftContent?: React.ReactNode;
  rightContent?: React.ReactNode;
  /**
   * fixed: 화면 하단에 고정됨
   * footer: 레이아웃 흐름상 하단에 배치됨
   */
  variant?: 'fixed' | 'footer';
  className?: string;
}

/**
 * 페이지 하단에 고정되어 주요 동작 버튼과 상태 정보를 보여주는 공통 컴포넌트입니다.
 */
const StickyDock = ({ 
  leftContent, 
  rightContent, 
  variant = 'fixed',
  className = ''
}: StickyDockProps) => {
  const baseStyles = "border-t border-slate-200 bg-white/95 backdrop-blur-xl px-4 md:px-8 py-3 flex items-center justify-between shadow-[0_-8px_30px_rgba(0,0,0,0.04)]"
  const positionStyles = variant === 'fixed' 
    ? "fixed bottom-0 left-0 right-0 z-[1000]" 
    : "relative z-30"

  return (
    <div className={`${baseStyles} ${positionStyles} ${className}`}>
      <div className="flex items-center gap-3 overflow-hidden">
        {leftContent}
      </div>
      <div className="flex items-center gap-2 md:gap-4 shrink-0 ml-4">
        {rightContent}
      </div>
    </div>
  )
}

export default StickyDock
