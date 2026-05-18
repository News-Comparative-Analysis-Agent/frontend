import React from 'react'
import { SidebarQuote } from '../../types/analysis'

interface DraftingLeftSidebarProps {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  sidebarQuotes: SidebarQuote[]
  isCrossCheckMode: boolean
  setIsCrossCheckMode: (mode: boolean) => void
  selectedQuote: SidebarQuote | null
  setSelectedQuote: (quote: SidebarQuote | null) => void
  setComparisonLayout: (enable: boolean) => void
  onOpenPopup: (url: string) => void
}

const DraftingLeftSidebar = ({ 
  isOpen, 
  setIsOpen, 
  sidebarQuotes,
  isCrossCheckMode,
  setIsCrossCheckMode,
  selectedQuote,
  setSelectedQuote,
  setComparisonLayout,
  onOpenPopup
}: DraftingLeftSidebarProps) => {



  return (
    <aside 
      id="left-sidebar"
      className={`flex flex-col bg-slate-50/50 shrink-0 overflow-hidden transition-all duration-300 relative group min-h-0 ${
        isOpen ? 'w-72 border-r border-slate-200' : 'w-0 border-none'
      }`}
    >
      <div className="flex-1 flex flex-col overflow-hidden">
        <div 
          className="py-2.5 px-4 border-b bg-white border-slate-200 flex items-center justify-between overflow-hidden shrink-0"
        >
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="size-8 rounded-full flex items-center justify-center bg-primary text-white shadow-md shrink-0">
              <span className="material-symbols-outlined icon-md">check</span>
            </div>
            <div className="flex flex-col overflow-hidden">
              <h2 className="font-bold text-[14.5px] tracking-tight text-slate-800 whitespace-nowrap">
                Cross-Check
              </h2>
            </div>
          </div>
          
          <div className="flex items-center gap-1.5 pr-1 shrink-0">
            {/* 사이드바 접기 버튼 */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(false);
              }}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              title="사이드바 접기"
            >
              <span className="material-symbols-outlined icon-md">menu_open</span>
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="p-3 space-y-3">
            {sidebarQuotes.map(quote => {
              const isSelected = selectedQuote?.id === quote.id;
              return (
                <div 
                  key={quote.id} 
                  className={`group/card border transition-all duration-300 overflow-hidden px-5 py-4 cursor-pointer flex flex-col h-full active:scale-[0.98] rounded-2xl ${
                    isSelected 
                      ? 'bg-orange-50 border-primary shadow-md ring-1 ring-primary/20' 
                      : 'bg-white border-slate-200 shadow-sm hover:shadow-md hover:border-primary/30'
                  }`}
                  onClick={() => {
                    setSelectedQuote(quote);
                    setIsCrossCheckMode(true);
                    setComparisonLayout(true);
                    onOpenPopup(quote.links?.[0]);
                  }}
                >
                  <div className="flex items-center gap-2 mb-2.5">
                    <span className={`text-[10px] font-black uppercase tracking-wider ${quote.textColor || 'text-slate-600'} px-2 py-0.5 ${quote.bg || 'bg-slate-50'} rounded-md border ${quote.borderColor?.replace('border-', 'border-') || 'border-slate-200'} ${isSelected ? 'opacity-100' : 'opacity-80'}`}>
                      {quote.media}
                    </span>
                    <div className={`flex items-center gap-0.5 text-[10px] font-bold transition-colors ${isSelected ? 'text-primary' : 'text-slate-400 group-hover/card:text-primary'}`}>
                      <span className="material-symbols-outlined icon-sm">{isSelected ? 'check_circle' : 'open_in_new'}</span>
                      <span>{isSelected ? '교차 검증 중' : '원문 비교하기'}</span>
                    </div>
                  </div>
                  <p
                    className={`text-[12px] leading-relaxed line-clamp-3 text-left transition-colors ${isSelected ? 'text-slate-800' : 'text-slate-600'}`}
                    style={{ fontStyle: 'italic', transform: 'skewX(-10deg)', transformOrigin: 'left bottom', display: 'block' }}
                  >
                    {quote.text}
                  </p>
                </div>
              );
            })}
            {sidebarQuotes.length === 0 && (
              <div className="py-20 flex flex-col items-center justify-center text-slate-300 gap-3">
                <span className="material-symbols-outlined icon-xl">fact_check</span>
                <p className="text-sm font-medium italic">분석된 상세 정보가 없습니다.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  )
}


export default DraftingLeftSidebar
