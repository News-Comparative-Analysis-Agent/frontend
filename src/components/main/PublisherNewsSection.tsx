import React, { useState, useEffect } from 'react'
import { NewsArticle } from '../../types'
import { motion, AnimatePresence } from 'framer-motion'

interface PublisherNewsSectionProps {
  loading: boolean
  error: string | null
  newsData: Record<string, Record<string, NewsArticle[]>>
  activeIssueType: 'politics' | 'editorial'
  allPublishers: string[]
  selectedMedia: string[]
  selectedDate: Date
  onDateChange: (date: Date) => void
  handleMediaChange: (media: string) => void
  filteredPublishers: string[]
  onOpenFilter?: () => void
}

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=800&auto=format&fit=crop'

const PUBLISHER_LOGOS: Record<string, string> = {
  '경향신문': 'https://upload.wikimedia.org/wikipedia/commons/b/b2/Kyunghyang_Shinmun_logo.png',
  '국민일보': 'https://news.kmib.co.kr/images/v2/logo_kmib.png',
  '동아일보': 'https://upload.wikimedia.org/wikipedia/commons/b/bd/Dong-A_Ilbo_logo.png',
  '조선일보': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Chosun_Ilbo_logo.png/512px-Chosun_Ilbo_logo.png',
  '중앙일보': 'https://upload.wikimedia.org/wikipedia/commons/2/2e/JoongAng_Ilbo_logo.png',
  '한겨레': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/The_Hankyoreh_logo.svg/512px-The_Hankyoreh_logo.svg.png',
  '한국일보': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/Hankook_Ilbo_logo.svg/512px-Hankook_Ilbo_logo.svg.png',
  'JTBC': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/JTBC_logo.svg/512px-JTBC_logo.svg.png',
  'MBC': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/MBC_Logo_2005.svg/512px-MBC_Logo_2005.svg.png',
  'YTN': 'https://upload.wikimedia.org/wikipedia/commons/4/4b/YTN_Logo.svg',
}

// 로고 에러 상태 관리
const PublisherLogo = ({ name }: { name: string }) => {
  const [error, setError] = useState(false);
  const logoUrl = PUBLISHER_LOGOS[name];

  if (!logoUrl || error) {
    return (
      <div className="size-5 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200">
        <span className="text-[10px] font-bold text-slate-400">{name[0]}</span>
      </div>
    );
  }

  return (
    <div className="size-5 rounded-full bg-white flex items-center justify-center overflow-hidden border border-slate-100">
      <img 
        src={logoUrl} 
        alt="" 
        className="w-full h-full object-contain p-0.5" 
        onError={() => setError(true)}
      />
    </div>
  );
};

const PublisherNewsSection = ({
  loading, error, newsData, activeIssueType, allPublishers, selectedMedia, selectedDate, onDateChange, handleMediaChange, filteredPublishers, onOpenFilter
}: PublisherNewsSectionProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedPublishers, setExpandedPublishers] = useState<Set<string>>(new Set());
  const itemsPerPage = 10;

  const toggleExpand = (publisher: string) => {
    const newSet = new Set(expandedPublishers);
    if (newSet.has(publisher)) {
      newSet.delete(publisher);
    } else {
      newSet.add(publisher);
    }
    setExpandedPublishers(newSet);
  };

  const totalPages = Math.ceil(filteredPublishers.length / itemsPerPage);
  const currentPublishers = filteredPublishers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const fadeScaleVariant = {
    initial: { opacity: 0, scale: 0.98, filter: 'blur(2px)' },
    animate: { opacity: 1, scale: 1, filter: 'blur(0px)' },
    exit: { opacity: 0, scale: 1.02, filter: 'blur(2px)' },
    transition: { duration: 0.15, ease: 'easeOut' as const }
  };

  return (
    <div className="flex flex-col w-full h-full bg-slate-50/30 p-2 rounded-3xl overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={activeIssueType}
          {...fadeScaleVariant}
          className="flex flex-col w-full"
        >
          <div className="flex flex-col mb-0 px-2 w-full">
            <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between w-full mb-2 mt-2 gap-4 md:gap-0">
              
              {/* [좌측 정렬 영역] 타이틀 + 안내문구 */}
              <div className="flex flex-col justify-center z-10 w-full md:w-auto gap-1.5 lg:gap-2 text-left py-1">
                <h2 className="text-slate-800 text-[17px] lg:text-[18px] xl:text-[19px] font-bold tracking-tight whitespace-nowrap">
                  각 언론사별 인기 뉴스에요
                </h2>
                <div className="flex items-center gap-1.5 text-[11px] xl:text-[12px] text-slate-500 font-medium opacity-80">
                  <span className="material-symbols-outlined text-[15px] text-primary">info</span>
                  이미지가 포함된 컴팩트한 리스트로 한눈에 확인하세요.
                </div>
              </div>

              {/* [우측 정렬 영역] 언론사 필터 */}
              <div className="flex items-center justify-end w-full md:w-auto">
                <button 
                  onClick={onOpenFilter}
                  className="flex items-center gap-1.5 px-3 lg:px-4 py-1.5 lg:py-2 rounded-xl bg-white border border-slate-200 hover:border-primary/50 hover:text-primary transition-all shadow-sm active:scale-95 group"
                >
                  <span className="material-symbols-outlined text-[16px] lg:text-[18px] text-primary transition-colors">tune</span>
                  <span className="text-[12px] lg:text-[13px] font-bold">언론사 필터</span>
                </button>
              </div>

            </div>
          </div>

      {/* 검은색 포인트 구분선 (길게) */}
      <div className="border-t-[3px] border-slate-800 w-full mb-4 mt-4"></div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mt-2">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="animate-pulse bg-white border border-slate-100 h-[450px] rounded-2xl shadow-sm" />
          ))}
        </div>
      ) : error ? (
        <div className="flex flex-col h-[400px]">
          <div className="flex flex-col items-center justify-center py-16 text-slate-400 gap-2 flex-1">
            <span className="material-symbols-outlined text-5xl">wifi_off</span>
            <p className="text-sm font-medium">{error}</p>
          </div>
        </div>
      ) : (
        <div className="flex-1 min-h-0">
          {filteredPublishers.length > 0 ? (
            <div className="flex flex-col">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-4 gap-y-5">
                {currentPublishers.map((publisher) => {
                  const year = selectedDate.getFullYear();
                  const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
                  const day = String(selectedDate.getDate()).padStart(2, '0');
                  const dateStr = `${year}-${month}-${day}`;
                  
                  const allArticles = newsData[dateStr]?.[publisher] || [];
                  const articles = allArticles.filter(a => !a.issue_type || a.issue_type === activeIssueType);
                  const isExpanded = expandedPublishers.has(publisher);
                  
                  return (
                    <motion.div 
                      layout
                      key={publisher} 
                      className="flex flex-col bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow"
                    >
                      {/* 카드 헤더: 로고 + 이름 + 화살표 */}
                      <div 
                        className="flex items-center justify-between p-3.5 bg-white border-b border-slate-50 cursor-pointer hover:bg-slate-50 transition-colors group/header"
                        onClick={() => toggleExpand(publisher)}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <PublisherLogo name={publisher} />
                          <h4 className="text-[14px] font-semibold text-slate-800 truncate leading-none group-hover/header:text-primary transition-colors">
                            {publisher}
                          </h4>
                        </div>
                        <div className="flex items-center gap-1 text-slate-400 group-hover/header:text-primary transition-colors">
                          <span className="text-[10px] font-medium uppercase tracking-tight transition-opacity text-slate-500 group-hover/header:text-primary/80">
                            {isExpanded ? 'Fold' : 'More'}
                          </span>
                          <span className={`material-symbols-outlined text-[18px] transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
                            expand_more
                          </span>
                        </div>
                      </div>

                      {/* 뉴스 리스트 (아코디언 형태) */}
                      <div className="flex flex-col divide-y divide-slate-50">
                        {articles.length > 0 ? (
                          <AnimatePresence initial={false}>
                            {(isExpanded ? articles.slice(0, 10) : articles.slice(0, 5)).map((article, idx) => (
                              <motion.a
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                layout
                                key={article.id}
                                href={article.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group/item flex gap-3 p-3 hover:bg-slate-50 transition-colors items-center"
                              >
                                {/* 좌측: 순위 */}
                                <span className="text-[15px] font-black text-slate-800 w-3.5 shrink-0 text-center leading-none">
                                  {idx + 1}
                                </span>
                                
                                {/* 중앙: 제목 + 시간 */}
                                <div className="flex-1 min-w-0 flex flex-col gap-1">
                                  <h5 className="text-[12px] font-normal text-slate-800 leading-[1.3] tracking-tight group-hover/item:text-primary transition-colors line-clamp-3">
                                    {article.title}
                                  </h5>
                                  <div className="flex items-center gap-1 text-slate-400">
                                    <span className="material-symbols-outlined text-[12px]">schedule</span>
                                    <span className="text-[10px] font-medium">3시간 전</span>
                                  </div>
                                </div>

                                {/* 우측: 정사각형 썸네일 */}
                                <div className="size-14 xl:size-16 shrink-0 rounded-lg overflow-hidden bg-slate-50 border border-slate-100 relative group-hover/item:border-primary/20 transition-colors">
                                  <img
                                    alt=""
                                    className="w-full h-full object-cover group-hover/item:scale-110 transition-transform duration-500"
                                    src={article.image_url || DEFAULT_IMAGE}
                                    onError={(e) => { (e.target as HTMLImageElement).src = DEFAULT_IMAGE; }}
                                  />
                                  {idx === 0 && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/5">
                                      <div className="size-5 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center">
                                        <span className="material-symbols-outlined text-[14px] text-slate-800 fill-current">play_arrow</span>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </motion.a>
                            ))}
                          </AnimatePresence>
                        ) : (
                          <div className="py-20 px-4 text-center">
                            <span className="material-symbols-outlined text-slate-200 text-3xl mb-2">article</span>
                            <p className="text-[11px] font-bold text-slate-300">집계된 뉴스가 없습니다</p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
              
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-1 mt-12 mb-6">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="size-9 flex items-center justify-center rounded-xl bg-white border border-slate-100 shadow-sm hover:bg-slate-50 disabled:opacity-30 transition-all text-slate-500"
                  >
                    <span className="material-symbols-outlined text-[20px]">chevron_left</span>
                  </button>
                  
                  <div className="flex items-center gap-1.5 mx-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`size-9 flex items-center justify-center rounded-xl text-[13px] font-bold transition-all ${
                          currentPage === pageNum 
                            ? 'bg-primary text-white shadow-md' 
                            : 'bg-white border border-slate-100 text-slate-500 hover:border-primary/30 hover:text-primary'
                        }`}
                      >
                        {pageNum}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="size-9 flex items-center justify-center rounded-xl bg-white border border-slate-100 shadow-sm hover:bg-slate-50 disabled:opacity-30 transition-all text-slate-500"
                  >
                    <span className="material-symbols-outlined text-[20px]">chevron_right</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 px-10 bg-white rounded-3xl border border-slate-100 shadow-sm">
              <div className="size-16 rounded-full bg-slate-50 flex items-center justify-center mb-6 shadow-inner">
                <span className="material-symbols-outlined text-3xl text-primary font-bold">tune</span>
              </div>
              <p className="text-slate-800 font-bold text-[18px] mb-2 tracking-tight">언론사가 아직 선택되지 않았어요</p>
              <p className="text-slate-500 text-sm leading-relaxed text-center">
                상단 필터에서 궁금한 언론사를 선택해 보세요.
              </p>
            </div>
          )}
        </div>
      )}

        </motion.div>
      </AnimatePresence>
    </div>
  )
}

export default PublisherNewsSection
