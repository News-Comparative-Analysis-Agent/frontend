import React, { useState, useEffect, useRef } from 'react'
import Button from '../ui/Button'
import Toast from '../ui/Toast'
import { AnimatePresence } from 'framer-motion'

interface DraftingFooterActionsProps {
  lastSaved: string | null
  isSaving: boolean
  saveDraft: () => void
  onFinalReview: () => void
  formatLastSaved: () => string
}

/**
 * 초안 작성 페이지 하단 액션 바
 * - 임시저장 상태 및 최종 검토 이동 버튼 포함
 * - 저장 성공 시 애니메이션 및 토스트 알림 제공
 */
const DraftingFooterActions = ({ lastSaved, isSaving, saveDraft, onFinalReview, formatLastSaved }: DraftingFooterActionsProps) => {
  const [showSuccess, setShowSuccess] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const prevLastSavedRef = useRef(lastSaved);

  // 1. 저장 완료 감지 (lastSaved 변경 시 실행)
  useEffect(() => {
    if (lastSaved && lastSaved !== prevLastSavedRef.current) {
      setShowSuccess(true);
      setShowToast(true);
      prevLastSavedRef.current = lastSaved;
    }
  }, [lastSaved]);

  // 2. 피드백 자동 해제 (showSuccess가 true가 될 때만 타이머 시작)
  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => {
        setShowSuccess(false);
        setShowToast(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [showSuccess]);

  return (
    <footer className="h-14 md:h-16 border-t border-slate-200 bg-white px-4 md:px-8 flex items-center justify-between z-30 shrink-0 shadow-[0_-4px_10px_-2px_rgba(0,0,0,0.03)] overflow-hidden">
      <AnimatePresence>
        {showToast && (
          <Toast 
            message="내용이 안전하게 저장되었습니다." 
            onClose={() => setShowToast(false)} 
          />
        )}
      </AnimatePresence>
      
      <div className="flex items-center gap-2 min-w-0">
        <span className={`flex items-center gap-1.5 text-[13px] md:text-[15px] font-medium tracking-tight transition-all duration-500 truncate ${showSuccess ? 'text-emerald-600 scale-105' : 'text-slate-600'}`}>
          <span className={`material-symbols-outlined text-[17px] md:text-[19px] ${showSuccess ? 'animate-bounce' : ''}`}>
            {showSuccess ? 'check_circle' : 'history'}
          </span>
          <span>
            <span className="hidden sm:inline">최근 저장:</span> {formatLastSaved()}
          </span>
        </span>
      </div>
      
      <div className="flex items-center gap-2 md:gap-3 shrink-0">
        <Button 
          variant={showSuccess ? "primary" : "outline"}
          icon={isSaving ? "sync" : (showSuccess ? "check" : "save")} 
          onClick={saveDraft}
          disabled={isSaving}
          className={`h-8 md:h-10 px-3 md:px-4 text-[12px] md:text-[14px] transition-all duration-500 ${
            isSaving ? "animate-spin-slow" : 
            showSuccess ? "bg-emerald-500 border-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.4)] scale-105" : ""
          }`}
        >
          <span className="font-bold">
            {isSaving ? '저장 중' : (showSuccess ? '완료' : '임시저장')}
          </span>
        </Button>
        <Button 
          onClick={onFinalReview}
          className="h-8 md:h-10 px-4 md:px-6 text-[12px] md:text-[14px] font-bold shadow-lg hover:shadow-primary/20 transition-all"
        >
          <span>검토</span>
        </Button>
      </div>
    </footer>
  )
}

export default DraftingFooterActions
