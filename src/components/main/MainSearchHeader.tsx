import React from 'react'
import FigmaHeaderCalendar from './FigmaHeaderCalendar'

interface MainSearchHeaderProps {
  selectedDate: Date
  onDateChange: (date: Date) => void
  searchQuery: string
  setSearchQuery: (query: string) => void
  onSearch: () => void
}

const MainSearchHeader = ({ 
  selectedDate, onDateChange, searchQuery, setSearchQuery, onSearch 
}: MainSearchHeaderProps) => {
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

  const removeSearch = (e: React.MouseEvent, query: string) => {
    e.stopPropagation()
    const newSearches = recentSearches.filter(s => s !== query)
    setRecentSearches(newSearches)
    localStorage.setItem('recent_searches', JSON.stringify(newSearches))
  }

  const handleHistoryClick = (query: string) => {
    setSearchQuery(query)
    // 딜레이를 살짝 주어 입력값이 반영된 후 검색 실행
    setTimeout(() => onSearch(), 10)
  }

  const handleInternalSearch = () => {
    saveSearch(searchQuery)
    onSearch()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleInternalSearch()
    }
  }

  return (
    <div className="max-w-[1280px] mx-auto px-4 xl:px-6 pt-3 pb-3 xl:pb-4 animate-fade-in">
      <div className="w-full flex items-center justify-between gap-8 py-2.5 border-b border-slate-300">
        
        {/* 좌측: 타이틀과 달력을 위아래로 배치 (세로 압축형) */}
        <div className="flex flex-col gap-1.5 shrink-0">
          {/* 1층: 타이틀 영역 */}
          <div className="flex items-center gap-3">
            <h1 className="text-[20px] xl:text-[17px] font-bold text-slate-800 tracking-tight leading-none inline-block">
              주간 뉴스 트렌드
            </h1>
            <div className="group relative flex items-center">
              <span className="material-symbols-outlined text-[13px] xl:text-[15px] text-primary cursor-help transition-colors">
                info
              </span>
              <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-slate-800 text-white text-[11px] font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap shadow-xl z-50">
                5월 4일 17시 기준
                <div className="absolute right-full top-1/2 -translate-y-1/2 border-[5px] border-transparent border-r-slate-800"></div>
              </div>
            </div>
          </div>

          {/* 2층: 달력 영역 (타이틀 바로 아래로 이동) */}
          <div className="calendar-container shrink-0 scale-90 origin-left -ml-1">
            <FigmaHeaderCalendar 
              selectedDate={selectedDate}
              onDateChange={onDateChange}
            />
          </div>
        </div>
        
        {/* 우측: 검색바 + 히스토리 영역 */}
        <div className="flex-1 flex flex-col items-end gap-1.5">
          {/* 검색바 윗줄 안내 문구 추가 */}
          <div className="w-full max-w-[400px] flex justify-end px-1">
            <span className="text-[14px] font-medium text-primary/80 tracking-tight">찾는 뉴스가 없으신가요 ?</span>
          </div>
          
          <div className="relative w-full max-w-[400px] group">
            <input
              id="header-search-input"
              className="w-full pl-5 pr-12 py-2 border border-slate-400 rounded-xl focus:outline-none focus:ring-8 focus:ring-primary/5 focus:border-primary/50 transition-all bg-white/80 shadow-sm placeholder:text-slate-400 font-medium text-[13px] text-slate-700"
              placeholder="원하는 기사 내용을 검색해보세요"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button
              className="absolute right-1.5 top-1/2 -translate-y-1/2 w-[32px] h-[32px] bg-primary text-white rounded-lg flex items-center justify-center shadow-lg shadow-primary/20 hover:bg-primary-dark transition-all hover:scale-105 active:scale-95"
              onClick={handleInternalSearch}
              type="button"
            >
              <span className="material-symbols-outlined text-[18px] font-bold">search</span>
            </button>
          </div>

          {/* 최근 검색어 히스토리 (오른쪽 정렬 적용) */}
          <div className="w-full max-w-[400px] flex items-center justify-end gap-2 overflow-hidden px-1">
            <span className="text-[10px] font-bold text-slate-400 shrink-0">최근 검색</span>
            <div className="flex items-center justify-end gap-1.5 overflow-x-auto no-scrollbar py-0.5">
              {recentSearches.length > 0 ? (
                recentSearches.map((term, i) => (
                  <div
                    key={i}
                    onClick={() => handleHistoryClick(term)}
                    className="flex items-center gap-1 px-2.5 py-1 bg-slate-100 border border-slate-200 rounded-full cursor-pointer hover:border-primary/30 group transition-all shrink-0"
                  >
                    <span className="text-[10px] font-medium text-slate-500 group-hover:text-primary whitespace-nowrap">{term}</span>
                    <button 
                      onClick={(e) => removeSearch(e, term)}
                      className="flex items-center text-slate-300 hover:text-rose-400 transition-colors"
                    >
                      <span className="material-symbols-outlined text-[11px]">close</span>
                    </button>
                  </div>
                ))
              ) : (
                <span className="text-[10px] font-medium text-slate-300 italic">기록 없음</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MainSearchHeader
