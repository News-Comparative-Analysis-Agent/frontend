import React from 'react'
import FigmaHeaderCalendar from './FigmaHeaderCalendar'

interface MainSearchHeaderProps {
  selectedDate: Date
  onDateChange: (date: Date) => void
}

const MainSearchHeader = ({ selectedDate, onDateChange }: MainSearchHeaderProps) => {
  return (
    <div className="max-w-[1280px] mx-auto px-6 pt-1 pb-4 animate-fade-in">
      {/* 💡 전체 너비 선반(Shelf) 스타일 - 상단 테두리 흰색 적용 버전 */}
      <div className="w-full bg-slate-50/90 backdrop-blur-sm px-0 py-2 shadow-[0_4px_15px_rgba(0,0,0,0.06)] border-b border-b-slate-300 border-t border-t-white flex items-center justify-between overflow-hidden">
        
        {/* 좌측 타이틀 영역 (w-1/2로 고정하여 정렬 기준 마련) */}
        <div className="flex flex-col text-left shrink-0 h-[48px] justify-between relative w-1/2">
          <div className="flex items-center gap-2">
            <h1 className="text-[22px] font-black text-slate-800 tracking-tight leading-none">
              주간 뉴스 트렌드
            </h1>
            <div className="group relative flex items-center">
              <span className="material-symbols-outlined text-[15px] text-primary cursor-help transition-colors">
                info
              </span>
              {/* 💡 우측 프리미엄 툴팁 */}
              <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-slate-800 text-white text-[11px] font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap shadow-xl z-50">
                0월 0일 0시 기준
                <div className="absolute right-full top-1/2 -translate-y-1/2 border-[5px] border-transparent border-r-slate-800"></div>
              </div>
            </div>
          </div>
          <p className="text-[12px] font-medium text-slate-400 tracking-tight leading-none">
            지난 일주일 간의 트렌드를 한눈에 확인해 보세요
          </p>
        </div>
        
        {/* 우측 달력 영역 - 하단 카테고리 바 정렬 기준 중간 지점 조정 (w-1/2, pl-8) */}
        <div className="calendar-container w-1/2 flex pl-8">
          <FigmaHeaderCalendar 
            selectedDate={selectedDate}
            onDateChange={onDateChange}
          />
        </div>
      </div>
    </div>
  )
}

export default MainSearchHeader
