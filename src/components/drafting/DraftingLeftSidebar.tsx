import React from 'react'
import Button from '../ui/Button'
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
}

const DraftingLeftSidebar = ({ 
  isOpen, 
  setIsOpen, 
  sidebarQuotes,
  isCrossCheckMode,
  setIsCrossCheckMode,
  selectedQuote,
  setSelectedQuote,
  setComparisonLayout
}: DraftingLeftSidebarProps) => {

  const openArticlePopup = (url: string) => {
    if (!url) return;
    
    const popupWidth = 800;
    const screenWidth = window.screen.availWidth;
    const screenHeight = window.screen.availHeight;

    // 1. 메인 창 제어 시도 (현재 창을 오른쪽 800px 지점으로 밀고 남은 너비를 채움)
    try {
      window.moveTo(popupWidth, 0);
      window.resizeTo(screenWidth - popupWidth, screenHeight);
    } catch (e) {
      console.warn("Main window control limited by browser policy");
    }
    
    // 2. 팝업창 열기 (왼쪽 끝 0,0 지점에 800px 너비로 배치)
    const features = `width=${popupWidth},height=${screenHeight},left=0,top=0,menubar=no,toolbar=no,location=no,status=no,resizable=yes,scrollbars=yes`;
    window.open(url, 'CrossCheckArticle', features);
  };

  return (
    <aside 
      id="left-sidebar"
      className={`border-r border-slate-200 flex flex-col bg-slate-50/50 shrink-0 overflow-hidden transition-all duration-300 relative group min-h-0 ${
        isOpen ? 'w-72' : '!w-0 !border-none'
      }`}
    >
      <div className="flex-1 flex flex-col overflow-hidden">
        <div 
          className="p-4 border-b bg-white border-slate-200 flex items-center justify-between overflow-hidden shrink-0"
        >
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="size-8 rounded-full flex items-center justify-center bg-primary text-white shadow-md shrink-0">
              <span className="material-symbols-outlined icon-md">check</span>
            </div>
            <div className="flex flex-col overflow-hidden">
              <h2 className="font-bold text-[14.5px] tracking-tight text-slate-800 whitespace-nowrap">
                Cross-Check
              </h2>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed font-medium">
                원문 기사를 비교하며<br />초안의 팩트를 체크해보세요
              </p>
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
                    setIsOpen(false); // 기사 선택 시 사이드바 자동 닫기
                    openArticlePopup(quote.links?.[0]);
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
                  <h4 className={`text-[13.5px] leading-relaxed font-bold transition-colors line-clamp-3 text-left ${isSelected ? 'text-slate-900' : 'text-slate-700'}`}>
                    {quote.text}
                  </h4>
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
