import React from 'react'
import Button from '../ui/Button'

interface AnalysisStickyDockProps {
  onDraftStart: () => void
}

const AnalysisStickyDock = ({ onDraftStart }: AnalysisStickyDockProps) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 h-14 md:h-16 z-[1000] bg-white/90 backdrop-blur-xl border-t border-slate-200 px-4 md:px-8 flex items-center justify-between shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
      <div className="flex items-center gap-3 flex-1 min-w-0 mr-4">
        <div className="size-2.5 rounded-full bg-green-500 animate-pulse shrink-0"></div>
        <div className="flex flex-col min-w-0 text-left">
          <p className="text-[13px] md:text-[14px] text-slate-600 font-medium tracking-tight leading-relaxed">심층 이슈 분석이 완료되었습니다. 바로 초안 작성을 시작할 수 있습니다.</p>
        </div>
      </div>
      <Button 
        onClick={onDraftStart}
        className="h-8 md:h-10 px-6 md:px-10 text-[12px] md:text-[14px] font-bold shadow-lg hover:shadow-primary/20 transition-all shrink-0"
      >
        초안 작성 시작
      </Button>
    </div>
  )
}

export default AnalysisStickyDock
