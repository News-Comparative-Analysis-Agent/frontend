import React from 'react'
import SectionHeader from '../ui/SectionHeader'

interface MainSearchHeaderProps {
  searchQuery: string
  setSearchQuery: (query: string) => void
  onSearch: () => void
}

const MainSearchHeader = ({ searchQuery, setSearchQuery, onSearch }: MainSearchHeaderProps) => {
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

  // 💡 최근 검색어 저장 로직
  const saveSearch = (query: string) => {
    if (!query.trim()) return
    const filtered = recentSearches.filter(s => s !== query.trim())
    const newSearches = [query.trim(), ...filtered].slice(0, 5) // 최대 5개
    setRecentSearches(newSearches)
    localStorage.setItem('recent_searches', JSON.stringify(newSearches))
  }

  // 💡 검색 실행 핸들러 (기록 저장 포함)
  const handleInternalSearch = () => {
    saveSearch(searchQuery)
    onSearch()
  }

  // 💡 기록 개별 삭제
  const removeSearch = (e: React.MouseEvent, query: string) => {
    e.stopPropagation()
    const newSearches = recentSearches.filter(s => s !== query)
    setRecentSearches(newSearches)
    localStorage.setItem('recent_searches', JSON.stringify(newSearches))
  }

  // 💡 기록 클릭 시 검색 실행
  const handleHistoryClick = (query: string) => {
    setSearchQuery(query)
    saveSearch(query)
    // 💡 다음 틱에서 검색 실행 (상태 업데이트 보장)
    setTimeout(() => onSearch(), 10)
  }

  return (
    <div className="max-w-[1280px] mx-auto px-6 pt-6 pb-0 animate-fade-in mb-0">
      <div className="flex flex-col md:flex-row items-start justify-between gap-4 border-b border-slate-200 pb-3 relative">
        {/* 💡 좌측: 오늘의 뉴스 트렌드 & 날짜 정보 */}
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
          <p className="text-[12px] font-bold text-slate-400 mt-[11px] flex items-center gap-1.5 leading-none">
            <span className="material-symbols-outlined text-[14px] leading-none">schedule</span>
            2026.02.23 14:00 기준
          </p>
        </div>

        {/* 💡 우측: 검색바 & 최근 검색어 (가로 너비 유지 및 2단 정렬) */}
        <div className="flex flex-col items-end w-full md:w-auto mt-2 md:mt-0">
          <div className="relative w-full md:w-[380px] focus-within:md:w-[480px] transition-all duration-500 ease-out group">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
              <span className="material-symbols-outlined text-[20px]">search</span>
            </div>
            <input
              id="search-input"
              className="w-full pl-10 pr-10 py-2 border border-slate-400 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all bg-white shadow-sm placeholder:text-slate-400 font-bold text-sm"
              placeholder="찾는 뉴스가 있으신가요?"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleInternalSearch()}
            />
            <button
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-primary transition-colors"
              onClick={handleInternalSearch}
              type="button"
            >
              <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
            </button>
          </div>

          {/* 💡 최근 검색어 (History Tags) - 좌측 날짜 정보와 평행 선상 정렬 (미세 조정) */}
          <div className="mt-[6px] flex items-center gap-2 flex-wrap justify-end">
            <span className="text-[11px] font-bold text-slate-300 mr-1">최근 검색</span>
            {recentSearches.length > 0 ? (
              recentSearches.map((term, i) => (
                <div
                  key={i}
                  onClick={() => handleHistoryClick(term)}
                  className="flex items-center gap-1 px-2 py-0.5 bg-slate-50 border border-slate-100 rounded-lg cursor-pointer hover:bg-orange-50 hover:border-orange-100 group transition-all"
                >
                  <span className="text-[11px] font-bold text-slate-500 group-hover:text-primary">{term}</span>
                  <button
                    onClick={(e) => removeSearch(e, term)}
                    className="flex items-center text-slate-300 hover:text-rose-500 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[12px]">close</span>
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
