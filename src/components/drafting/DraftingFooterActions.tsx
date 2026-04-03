import React from 'react'
import Button from '../ui/Button'

interface DraftingFooterActionsProps {
  lastSaved: string | null
  saveDraft: () => void
  onFinalReview: () => void
  formatLastSaved: () => string
}

const DraftingFooterActions = ({ lastSaved, saveDraft, onFinalReview, formatLastSaved }: DraftingFooterActionsProps) => {
  return (
    <footer className="h-20 border-t border-slate-200 bg-white px-4 md:px-8 flex items-center justify-between z-30 shrink-0 shadow-[0_-4px_10px_-2px_rgba(0,0,0,0.03)]">
      <div className="flex items-center gap-2">
        <span className="flex items-center gap-1.5 text-[12px] font-medium text-slate-400 tracking-tight">
          <span className="material-symbols-outlined icon-sm">history</span>
          마지막 저장: {formatLastSaved()}
        </span>
      </div>
      <div className="flex items-center gap-2 md:gap-3">
        <Button variant="outline" icon="save" onClick={saveDraft}>
          <span>임시저장</span>
        </Button>
        <Button 
          onClick={onFinalReview}
          size="lg"
          className="px-10"
        >
          <span>검토 이동</span>
        </Button>
      </div>
    </footer>
  )
}

export default DraftingFooterActions
