import React from 'react'
import FigmaHeaderCalendar from './FigmaHeaderCalendar'

interface MainSearchHeaderProps {
  searchQuery: string
  setSearchQuery: (query: string) => void
  onSearch: () => void
  selectedDate: Date
  onDateChange: (date: Date) => void
}

const MainSearchHeader = ({ searchQuery, setSearchQuery, onSearch, selectedDate, onDateChange }: MainSearchHeaderProps) => {
  const [recentSearches, setRecentSearches] = React.useState<string[]>([])

  // 💡 초기 로드 시 localStorage에서 최근 검색어 불러오기
  React.useEffect(() => {
    const saved = localStorage.getItem('recent_searches')
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved))
      } catch (e) {
        console.error('Failed to parse recent searches', e)
      }
    }
  }, [])

  const saveSearch = (query: string) => {
    if (!query.trim()) return
    const filtered = recentSearches.filter(s => s !== query.trim())
    const newSearches = [query.trim(), ...filtered].slice(0, 5)
    setRecentSearches(newSearches)
    localStorage.setItem('recent_searches', JSON.stringify(newSearches))
  }

  const handleInternalSearch = () => {
    saveSearch(searchQuery)
    onSearch()
  }

  const removeSearch = (e: React.MouseEvent, query: string) => {
    e.stopPropagation()
    const newSearches = recentSearches.filter(s => s !== query)
    setRecentSearches(newSearches)
    localStorage.setItem('recent_searches', JSON.stringify(newSearches))
  }

  const handleHistoryClick = (query: string) => {
    setSearchQuery(query)
    saveSearch(query)
    setTimeout(() => onSearch(), 10)
  }

  return (
    <div className="max-w-[1280px] mx-auto px-6 pt-2 pb-0 animate-fade-in">
      <div className="flex flex-col md:flex-row gap-4 items-center">
        
        {/* 💡 좌측 그룹: 하단 PublisherNewsSection 가로폭과 정렬 (md:w-1/2) */}
        <div className="w-full md:w-1/2 flex items-center justify-between">
          <div className="flex flex-col text-left shrink-0">
            <h1 className="text-[24px] font-black text-slate-900 tracking-tight leading-tight">
              주간 뉴스 트렌드
            </h1>
            <p className="text-[11px] font-medium text-slate-400 tracking-tight -mt-0.5">
              지난 일주일 간의 트렌드
            </p>
          </div>
          
          <div className="calendar-container flex-1 flex justify-end">
            <FigmaHeaderCalendar 
              selectedDate={selectedDate}
              onDateChange={onDateChange}
            />
          </div>
        </div>

        {/* 💡 우측 그룹: 하단 PopularIssuesSection 가로폭과 정렬 (md:w-1/2) */}
        <div className="w-full md:w-1/2 flex flex-col items-end pl-4 border-l border-slate-100">
          <div className="relative w-full max-w-[400px] group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-300 group-focus-within:text-primary transition-colors">
              <span className="material-symbols-outlined text-[20px]">search</span>
            </div>
            <input
              id="search-input"
              className="w-full pl-10 pr-12 py-3 border border-slate-200 rounded-full focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/50 transition-all bg-white shadow-sm placeholder:text-slate-300 font-bold text-[14px]"
              placeholder="찾는 뉴스가 있으신가요?"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleInternalSearch()}
            />
            <button
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-300 hover:text-primary transition-colors"
              onClick={handleInternalSearch}
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          </div>

          {/* 최근 검색어 태그 */}
          <div className="mt-2.5 flex items-center gap-2 flex-wrap justify-end max-w-[400px]">
            <span className="text-[11px] font-bold text-slate-300 mr-1">최근 검색</span>
            {recentSearches.length > 0 ? (
              recentSearches.map((term, i) => (
                <div
                  key={i}
                  onClick={() => handleHistoryClick(term)}
                  className="flex items-center gap-1.5 px-2.5 py-0.5 bg-slate-50 border border-slate-100 rounded-full cursor-pointer hover:bg-white hover:shadow-sm group transition-all"
                >
                  <span className="text-[11px] font-bold text-slate-500 group-hover:text-primary">{term}</span>
                  <button
                    onClick={(e) => removeSearch(e, term)}
                    className="flex items-center text-slate-300 hover:text-rose-400 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[13px]">close</span>
                  </button>
                </div>
              ))
            ) : (
              <span className="text-[11px] font-medium text-slate-300 italic">기록 없음</span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default MainSearchHeader
