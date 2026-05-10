import React, { useState, useEffect } from 'react'
import Button from '../ui/Button'
import Toast from '../ui/Toast'

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
  const [prevLastSaved, setPrevLastSaved] = useState(lastSaved);

  // 저장 완료 감지 로직
  useEffect(() => {
    if (prevLastSaved !== lastSaved && lastSaved !== null) {
      setShowSuccess(true);
      setShowToast(true);
      setPrevLastSaved(lastSaved);
      
      // 3초 후 성공 상태 해제
      const timer = setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [lastSaved, prevLastSaved]);

  return (
    <footer className="h-20 border-t border-slate-200 bg-white px-4 md:px-8 flex items-center justify-between z-30 shrink-0 shadow-[0_-4px_10px_-2px_rgba(0,0,0,0.03)]">
      {showToast && (
        <Toast 
          message="현재까지 작성된 내용이 안전하게 저장되었습니다." 
          onClose={() => setShowToast(false)} 
        />
      )}
      
      <div className="flex items-center gap-2">
        <span className={`flex items-center gap-1.5 text-[14px] font-normal tracking-tight transition-all duration-500 ${showSuccess ? 'text-emerald-600 scale-105' : 'text-slate-600'}`}>
          <span className={`material-symbols-outlined text-[18px] ${showSuccess ? 'animate-bounce' : ''}`}>
            {showSuccess ? 'check_circle' : 'history'}
          </span>
          <span className={showSuccess ? 'font-bold' : ''}>
            마지막 저장: {formatLastSaved()}
          </span>
        </span>
      </div>
      
      <div className="flex items-center gap-2 md:gap-3">
        <Button 
          variant={showSuccess ? "primary" : "outline"}
          icon={isSaving ? "sync" : (showSuccess ? "check" : "save")} 
          onClick={saveDraft}
          disabled={isSaving}
          className={`transition-all duration-500 ${
            isSaving ? "animate-spin-slow" : 
            showSuccess ? "bg-emerald-500 border-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.4)] scale-105" : ""
          }`}
        >
          <span className="font-bold">
            {isSaving ? '저장 중...' : (showSuccess ? '저장 완료' : '임시저장')}
          </span>
        </Button>
        <Button 
          onClick={onFinalReview}
          size="lg"
          className="px-10 shadow-lg hover:shadow-primary/20 transition-all"
        >
          <span className="font-bold">검토 이동</span>
        </Button>
      </div>
    </footer>
  )
}

export default DraftingFooterActions
