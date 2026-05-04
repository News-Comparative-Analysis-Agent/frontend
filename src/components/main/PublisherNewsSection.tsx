import React, { useState, useEffect } from 'react'
import { NewsArticle } from '../../types'
import MonthlyCalendar from './MonthlyCalendar'

interface PublisherNewsSectionProps {
  loading: boolean
  error: string | null
  newsData: Record<string, Record<string, NewsArticle[]>>
  allPublishers: string[]
  selectedMedia: string[]
  selectedDate: Date
  onDateChange: (date: Date) => void
  handleMediaChange: (media: string) => void
  filteredPublishers: string[]
}

// 모든 언론사에 동일한 스타일 적용 (진한 회색으로 통일)
const DEFAULT_STYLE = { borderColor: 'border-slate-700', color: 'bg-slate-700', textColor: 'text-primary' }
const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=800&auto=format&fit=crop'

const PublisherNewsSection = ({
  loading, error, newsData, allPublishers, selectedMedia, selectedDate, onDateChange, handleMediaChange, filteredPublishers
}: PublisherNewsSectionProps) => {
  const formattedDate = `${selectedDate.getFullYear()}년 ${selectedDate.getMonth() + 1}월 ${selectedDate.getDate()}일`;

  const [currentPage, setCurrentPage] = useState(1);
  const [activeIssueType, setActiveIssueType] = useState<'all' | 'politics' | 'editorial'>('all');
  const itemsPerPage = 6;

  // 필터가 변경되면 1페이지로 리셋
  // 배열 레퍼런스 변경으로 인한 불필요한 초기화를 막기 위해 문자열로 변환하여 비교
  useEffect(() => {
    setCurrentPage(1);
  }, [filteredPublishers.join(',')]);

  const totalPages = Math.ceil(filteredPublishers.length / itemsPerPage);
  const currentPublishers = filteredPublishers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="flex flex-col w-full h-full">
      <div className="flex flex-col mb-0">
        <div className="flex items-center justify-between h-9 mb-1.5 mt-1">
          <h2 className="text-slate-800 text-base font-bold tracking-tight">
            각 언론사별 인기 뉴스에요
          </h2>

          {/* 이슈 타입 선택 탭 - 크기 확대 */}
          <div className="flex items-center gap-1 p-1 bg-slate-50 rounded-xl border border-slate-100">
            <button
              onClick={() => setActiveIssueType('all')}
              className={`px-5 py-1.5 rounded-lg text-[12px] font-bold transition-all ${
                activeIssueType === 'all' 
                  ? 'bg-white text-primary shadow-sm border border-slate-100' 
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              전체
            </button>
            <button
              onClick={() => setActiveIssueType('politics')}
              className={`px-5 py-1.5 rounded-lg text-[12px] font-bold transition-all ${
                activeIssueType === 'politics' 
                  ? 'bg-white text-primary shadow-sm border border-slate-100' 
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              정치
            </button>
            <button
              onClick={() => setActiveIssueType('editorial')}
              className={`px-5 py-1.5 rounded-lg text-[12px] font-bold transition-all ${
                activeIssueType === 'editorial' 
                  ? 'bg-white text-primary shadow-sm border border-slate-100' 
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              사설
            </button>
          </div>
        </div>
        <div className="flex items-center gap-1.5 mb-2 text-[12px] text-slate-500 font-medium opacity-90">
          <span className="material-symbols-outlined text-[14px] text-primary">tune</span>
          필터를 통해 원하는 언론사의 뉴스만 골라보세요.
        </div>
        <div className="w-full h-px bg-slate-100 mb-0"></div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-x-4 gap-y-4 -mx-1">
          {[1, 2, 3].map(i => (
            <div key={i} className="animate-pulse space-y-3">
              <div className="h-3 w-20 bg-slate-200 rounded" />
              <div className="w-full aspect-video bg-slate-200 rounded-md" />
              <div className="h-4 bg-slate-200 rounded w-3/4" />
              {[...Array(5)].map((_, j) => <div key={j} className="h-3 bg-slate-100 rounded" />)}
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="flex flex-col h-[820px]">
          <div className="flex flex-col items-center justify-center py-16 text-slate-400 gap-2 flex-1">
            <span className="material-symbols-outlined text-5xl">wifi_off</span>
            <p className="text-sm font-medium">{error}</p>
          </div>
        </div>
      ) : (
        <div className="flex-1 min-h-0 overflow-y-auto pr-2 custom-scrollbar">
          {filteredPublishers.length > 0 ? (
            <div className="flex flex-col min-h-[600px]">
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-x-4 gap-y-4 -mx-1">
                {currentPublishers.map((publisher) => {
                const year = selectedDate.getFullYear();
                const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
                const day = String(selectedDate.getDate()).padStart(2, '0');
                const dateStr = `${year}-${month}-${day}`;
                
                const allArticles = newsData[dateStr]?.[publisher] || [];
                const articles = activeIssueType === 'all' 
                  ? allArticles 
                  : allArticles.filter(a => a.issue_type === activeIssueType);
                
                const style = DEFAULT_STYLE;
                
                return (
                  <div key={publisher} className="shadow-premium-card px-2.5 py-4 transition-all duration-300 bg-white">
                    <div className={`border-t-[3px] ${style.borderColor} mb-4`}></div>
                    <div className="flex items-center justify-between mb-5">
                      <h4 className="text-lg font-semibold text-slate-700 flex items-center gap-1">
                        {publisher} <span className="material-symbols-outlined text-sm">chevron_right</span>
                      </h4>
                    </div>
                    <div className="space-y-0 divide-y divide-slate-50">
                      {articles.length > 0 ? (
                        articles.slice(0, 10).map((article, idx) => (
                          <a
                            key={article.id}
                            href={article.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`${idx === 0 ? 'pb-4 pt-1 border-b border-slate-100 block' : 'py-[7px] flex gap-3 items-baseline'} group/item cursor-pointer`}
                          >
                            {idx === 0 ? (
                              <>
                                <div className="relative w-full aspect-video mb-3 overflow-hidden rounded-md bg-slate-100">
                                  <img
                                    alt={article.title}
                                    className="w-full h-full object-cover group-hover/item:scale-105 transition-transform duration-500"
                                    src={article.image_url || DEFAULT_IMAGE}
                                    onError={(e) => { (e.target as HTMLImageElement).src = DEFAULT_IMAGE; }}
                                  />
                                  <div className={`absolute top-2 left-2 size-7 ${style.color} text-white flex items-center justify-center font-bold rank-number rounded shadow-md text-xs`}>1</div>
                                </div>
                                <h5 className={`text-[13px] font-bold text-slate-900 leading-snug group-hover/item:text-primary transition-colors line-clamp-2`}>
                                  {article.title}
                                </h5>
                              </>
                            ) : (
                              <>
                                <span className="rank-number text-[11px] font-bold text-slate-400 w-4 text-center shrink-0">{idx + 1}</span>
                                <p className={`text-[12px] font-medium text-slate-700 truncate flex-1 group-hover/item:text-primary transition-colors`}>
                                  {article.title}
                                </p>
                              </>
                            )}
                          </a>
                        ))
                      ) : (
                        <div className="flex flex-col items-center justify-center py-10 px-2 text-center bg-slate-50/50 rounded-xl mt-2 border border-dashed border-slate-200">
                          <div className="size-10 rounded-full bg-white flex items-center justify-center mb-3 shadow-sm border border-slate-100">
                            <span className="material-symbols-outlined text-slate-300 text-xl">article</span>
                          </div>
                          <p className="text-[13px] font-bold text-slate-500 mb-1">아직 집계된 뉴스가 없어요</p>
                          <p className="text-[11px] text-slate-400 leading-relaxed">언론사 인기 뉴스를 수집 중입니다.</p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
              </div>
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-1 mt-8 mb-6">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="size-8 flex items-center justify-center rounded-full hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent transition-colors text-slate-500"
                  >
                    <span className="material-symbols-outlined text-[20px]">chevron_left</span>
                  </button>
                  
                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`size-8 flex items-center justify-center rounded-full text-[13px] font-bold transition-all ${
                          currentPage === pageNum 
                            ? 'bg-primary text-white shadow-sm' 
                            : 'hover:bg-slate-100 text-slate-500'
                        }`}
                      >
                        {pageNum}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="size-8 flex items-center justify-center rounded-full hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent transition-colors text-slate-500"
                  >
                    <span className="material-symbols-outlined text-[20px]">chevron_right</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 px-10 bg-slate-50/50 rounded-3xl border border-dashed border-slate-200">
              <div className="size-16 rounded-full bg-slate-100 flex items-center justify-center mb-6 animate-bounce shadow-inner">
                <span className="material-symbols-outlined text-3xl text-primary font-bold">tune</span>
              </div>
              <p className="text-slate-800 font-bold text-[18px] mb-2 tracking-tight">언론사가 아직 선택되지 않았어요</p>
              <p className="text-slate-500 text-sm leading-relaxed text-center">
                궁금한 언론사를 상단 필터에서 선택해 보세요.<br />
                해당 언론사의 실시간 인기 뉴스를 바로 확인할 수 있습니다!
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default PublisherNewsSection
