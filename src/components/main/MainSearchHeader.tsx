import React from 'react'
import SectionHeader from '../ui/SectionHeader'

interface MainSearchHeaderProps {
  searchQuery: string
  setSearchQuery: (query: string) => void
  onSearch: () => void
}

const MainSearchHeader = ({ searchQuery, setSearchQuery, onSearch }: MainSearchHeaderProps) => {
  return (
    <div className="max-w-[1400px] mx-auto px-6 pt-8">
      <div className="flex items-center justify-between border-b-2 border-slate-900/5 pb-6">
        <SectionHeader
          icon="pulse_dot"
          title="오늘의 뉴스 트렌드"
          description="2026.02.23 14:00 기준"
        />
        <div className="relative w-[380px] focus-within:w-[480px] transition-all duration-500 ease-out group">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
            <span className="material-symbols-outlined text-[20px]">search</span>
          </div>
          <input
            id="search-input"
            className="w-full pl-10 pr-10 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all bg-white shadow-sm placeholder:text-slate-400"
            placeholder="포커스에서 분석하고 싶은 뉴스를 검색해보세요"
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
