import React from 'react'
import Button from '../ui/Button'
import { SidebarQuote } from '../../types/analysis'

interface DraftingLeftSidebarProps {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  sidebarQuotes: SidebarQuote[]
}

const DraftingLeftSidebar = ({ isOpen, setIsOpen, sidebarQuotes }: DraftingLeftSidebarProps) => {
  return (
    <aside 
      id="left-sidebar"
      className={`w-72 border-r border-slate-200 flex flex-col bg-slate-50/50 shrink-0 overflow-hidden transition-all duration-300 relative group min-h-0 ${isOpen ? '' : '!w-0 !border-none'}`}
    >
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-white flex items-center justify-between">
          <h2 className="font-bold text-xs uppercase tracking-widest flex items-center gap-1 md:gap-2 text-slate-600">
            <span className="material-symbols-outlined text-primary text-lg">format_quote</span>
            핵심 인용구 저장소
          </h2>
          <Button 
            variant="ghost" 
            size="icon" 
            icon="menu_open"
            onClick={() => setIsOpen(false)}
            className="size-8 rounded-full"
            title="사이드바 접기"
          />
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-3">
          {sidebarQuotes.map(quote => (
            <div 
              key={quote.id} 
              className={`bg-white border-l-4 ${quote.borderColor || 'border-slate-300'} rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden px-4 py-3.5 cursor-pointer`}
              onClick={() => quote.links?.[0] && window.open(quote.links[0], '_blank')}
            >
              <div className="flex items-center gap-2 mb-2.5">
                <span className={`text-[10px] font-black uppercase tracking-wider ${quote.textColor || 'text-slate-600'} px-2 py-0.5 ${quote.bg || 'bg-slate-50'} rounded-md border ${quote.borderColor?.replace('border-', 'border-') || 'border-slate-200'} opacity-80`}>
                  {quote.media}
                </span>
                <div className="flex items-center gap-0.5 text-[10px] font-bold text-slate-400 hover:text-primary transition-colors">
                  <span className="material-symbols-outlined text-[12px]">open_in_new</span>
                  <span>원문 보기</span>
                </div>
              </div>
              <h4 className="text-[13.5px] leading-relaxed text-slate-700 font-bold transition-colors line-clamp-3 text-left">
                {quote.text}
              </h4>
            </div>
          ))}
          {sidebarQuotes.length === 0 && (
            <div className="py-20 flex flex-col items-center justify-center text-slate-300 gap-3">
              <span className="material-symbols-outlined text-[40px]">format_quote</span>
              <p className="text-sm font-medium">인용할 수 있는 핵심 정보가 없습니다.</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  )
}

export default DraftingLeftSidebar
