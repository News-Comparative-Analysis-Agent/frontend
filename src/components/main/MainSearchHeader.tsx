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
    <div className="max-w-[1280px] mx-auto px-6 pt-6 pb-6 animate-fade-in">
      <div className="flex flex-col md:flex-row gap-4 items-center">
        
        {/* 💡 좌측 그룹: 완벽한 직선 선반(Shelf) 스타일 - 세로 높이 최소화 */}
        <div className="w-full md:w-1/2 bg-slate-50/90 backdrop-blur-sm px-5 py-1.5 shadow-[0_4px_15px_rgba(0,0,0,0.06)] border-y border-y-slate-300 flex items-center justify-between">
          <div className="flex flex-col text-left shrink-0 h-[42px] justify-between relative -left-5">
            <h1 className="text-[20px] font-black text-slate-800 tracking-tight leading-none">
              주간 뉴스 트렌드
            </h1>
            <p className="text-[11px] font-medium text-slate-400 tracking-tight leading-none">
              지난 일주일 간의 트렌드를 확인할 수 있어요
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
        <div className="w-full md:w-1/2 flex flex-col items-end pl-4 border-l border-slate-100 h-[72px] justify-between pb-[4px]">
          <div className="relative w-full max-w-[400px] group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-300 group-focus-within:text-primary transition-colors">
              <span className="material-symbols-outlined text-[18px]">search</span>
            </div>
            <input
              id="search-input"
              className="w-full pl-10 pr-12 py-[6px] border border-slate-300 rounded-full focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/50 transition-all bg-white shadow-sm placeholder:text-slate-400 font-medium text-[14px] text-slate-700"
              placeholder="찾는 뉴스가 있으신가요?"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleInternalSearch()}
            />
            <button
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-primary transition-colors"
              onClick={handleInternalSearch}
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          </div>

          {/* 최근 검색어 태그 (히스토리) */}
          <div className="flex items-center gap-2 flex-wrap justify-end max-w-[400px]">
            <span className="text-[11px] font-medium text-slate-400 mr-1">최근 검색</span>
            {recentSearches.length > 0 ? (
              recentSearches.map((term, i) => (
                <div
                  key={i}
                  onClick={() => handleHistoryClick(term)}
                  className="flex items-center gap-1.5 px-2.5 py-0.5 bg-slate-50 border border-slate-200 rounded-full cursor-pointer hover:bg-white hover:shadow-sm group transition-all"
                >
                  <span className="text-[11px] font-medium text-slate-600 group-hover:text-primary">{term}</span>
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
