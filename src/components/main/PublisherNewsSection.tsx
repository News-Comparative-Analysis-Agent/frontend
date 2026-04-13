import React from 'react'
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

const PUBLISHER_STYLES: Record<string, { borderColor: string; color: string; textColor: string }> = {
  '조선일보': { borderColor: 'border-slate-500', color: 'bg-slate-600', textColor: 'text-primary' },
  '한겨레': { borderColor: 'border-slate-500', color: 'bg-slate-600', textColor: 'text-primary' },
  '경향신문': { borderColor: 'border-slate-500', color: 'bg-slate-600', textColor: 'text-primary' },
  '동아일보': { borderColor: 'border-slate-500', color: 'bg-slate-600', textColor: 'text-primary' },
  '연합뉴스': { borderColor: 'border-slate-500', color: 'bg-slate-600', textColor: 'text-primary' },
}
const DEFAULT_STYLE = { borderColor: 'border-slate-400', color: 'bg-slate-400', textColor: 'text-primary' }
const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=800&auto=format&fit=crop'

const PublisherNewsSection = ({
  loading, error, newsData, allPublishers, selectedMedia, selectedDate, onDateChange, handleMediaChange, filteredPublishers
}: PublisherNewsSectionProps) => {
  const formattedDate = `${selectedDate.getFullYear()}년 ${selectedDate.getMonth() + 1}월 ${selectedDate.getDate()}일`;

  return (
    <div className="flex flex-col w-full h-full">
      <div className="flex flex-col mb-4">
        <div className="flex items-center justify-between h-8 mb-4">
          <h2 className="text-slate-800 text-xl font-bold tracking-tight section-highlight">
            각 언론사별 인기 뉴스에요
          </h2>
        </div>
        <div className="flex items-center gap-1.5 mb-3 text-[12px] text-slate-500 font-medium opacity-90">
          <span className="material-symbols-outlined text-[14px] text-primary">info</span>
          필터를 선택하여 원하는 언론사의 인기 뉴스만 골라볼 수 있어요.
        </div>
        <div className="w-full h-px bg-slate-100 mb-6"></div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="animate-pulse space-y-3">
              <div className="h-3 w-20 bg-slate-200 rounded" />
              <div className="w-full aspect-video bg-slate-200 rounded-xl" />
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-3 gap-y-4">
              {filteredPublishers.map((publisher) => {
                const year = selectedDate.getFullYear();
                const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
                const day = String(selectedDate.getDate()).padStart(2, '0');
                const dateStr = `${year}-${month}-${day}`;
                
                const articles = newsData[dateStr]?.[publisher] || [];
                const style = PUBLISHER_STYLES[publisher] ?? DEFAULT_STYLE;
                
                return (
                  <div key={publisher} className="shadow-premium-card p-4 transition-all duration-300 group/card bg-white">
                    <div className={`border-t-[3px] ${style.borderColor} mb-4`}></div>
                    <div className="flex items-center justify-between mb-5">
                      <h4 className="text-lg font-bold text-slate-700 flex items-center gap-1 group-hover/card:text-primary transition-colors">
                        {publisher} <span className="material-symbols-outlined text-sm group-hover/card:translate-x-1 transition-transform">chevron_right</span>
                      </h4>
                    </div>
                    <div className="space-y-0 divide-y divide-slate-50">
                      {articles.slice(0, 10).map((article, idx) => (
                        <a
                          key={article.id}
                          href={article.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`${idx === 0 ? 'pb-6 pt-1 border-b border-slate-100 block' : 'py-2.5 flex gap-3 items-baseline'} group/item cursor-pointer`}
                        >
                          {idx === 0 ? (
                            <>
                              <div className="relative w-full aspect-video mb-3 overflow-hidden rounded-xl bg-slate-100">
                                <img
                                  alt={article.title}
                                  className="w-full h-full object-cover group-hover/item:scale-105 transition-transform duration-500"
                                  src={article.image_url || DEFAULT_IMAGE}
                                  onError={(e) => { (e.target as HTMLImageElement).src = DEFAULT_IMAGE; }}
                                />
                                <div className={`absolute top-2 left-2 size-7 ${style.color} text-white flex items-center justify-center font-bold rank-number rounded shadow-md text-xs`}>1</div>
                              </div>
                              <h5 className={`text-[14px] font-bold text-slate-900 leading-snug group-hover/item:${style.textColor} transition-colors line-clamp-2`}>
                                {article.title}
                              </h5>
                            </>
                          ) : (
                            <>
                              <span className="rank-number text-xs font-bold text-slate-400 w-4 text-center shrink-0">{idx + 1}</span>
                              <p className={`text-[12.5px] font-medium text-slate-700 truncate flex-1 group-hover/item:${style.textColor} transition-colors`}>
                                {article.title}
                              </p>
                            </>
                          )}
                        </a>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 px-10 bg-slate-50/50 rounded-3xl border border-dashed border-slate-200">
              <div className="size-16 rounded-full bg-slate-100 flex items-center justify-center mb-6 animate-bounce shadow-inner">
                <span className="material-symbols-outlined text-3xl text-primary">touch_app</span>
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
