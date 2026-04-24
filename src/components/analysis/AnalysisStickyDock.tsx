import React from 'react'
import Button from '../ui/Button'

interface AnalysisStickyDockProps {
  onDraftStart: () => void
}

const AnalysisStickyDock = ({ onDraftStart }: AnalysisStickyDockProps) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-[1000] bg-white/90 backdrop-blur-xl border-t border-slate-200 px-8 py-4 flex items-center justify-between shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
      <div className="flex items-center gap-3">
        <div className="size-2 rounded-full bg-green-500 animate-pulse"></div>
        <span className="text-slate-600 font-medium text-[13px] tracking-tight text-left">심층 이슈 분석이 모두 완료되었습니다. 분석된 맥락을 바탕으로 바로 초안을 작성할 수 있습니다.</span>
      </div>
      <Button 
        onClick={onDraftStart}
        size="lg"
      >
        초안 작성 시작
      </Button>
    </div>
  )
}

export default AnalysisStickyDock
