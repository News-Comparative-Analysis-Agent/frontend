import React from 'react'
import SectionHeader from '../ui/SectionHeader'

interface MainSearchHeaderProps {
  searchQuery: string
  setSearchQuery: (query: string) => void
  onSearch: () => void
}

const MainSearchHeader = ({ searchQuery, setSearchQuery, onSearch }: MainSearchHeaderProps) => {
  return (
    <div className="max-w-[1400px] mx-auto px-6 pt-6 pb-2 animate-fade-in">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-slate-100 pb-4 relative">
        {/* 💡 초간결 헤더 영역: 여백 전면 삭제 및 미니멀 라이브 인디케이터 */}
        <div className="flex flex-col text-left">
          <div className="flex items-center gap-2">
            <div className="relative flex size-2 mb-0.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-40"></span>
              <span className="relative inline-flex rounded-full size-2 bg-primary"></span>
            </div>
            <h2 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight leading-none">
              오늘의 뉴스 트렌드
            </h2>
          </div>
          <p className="text-[12px] font-bold text-slate-400 mt-1.5 flex items-center gap-1.5 leading-none">
            <span className="material-symbols-outlined text-[14px] leading-none">schedule</span>
            2026.02.23 14:00 기준
          </p>
        </div>

        {/* 💡 검색바: 심플 디자인 & 여백 최적화 */}
        <div className="relative w-full md:w-[380px] focus-within:md:w-[480px] transition-all duration-500 ease-out group mt-2 md:mt-0">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
            <span className="material-symbols-outlined text-[20px]">search</span>
          </div>
          <input
            id="search-input"
            className="w-full pl-10 pr-10 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all bg-white shadow-sm placeholder:text-slate-300 font-bold text-sm"
            placeholder="찾는 뉴스가 있으신가요?"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && onSearch()}
          />
          <button
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-primary transition-colors"
            onClick={onSearch}
            type="button"
          >
            <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default MainSearchHeader
