import React, { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import WeeklyCalendar from './WeeklyCalendar'
import MonthlyCalendar from './MonthlyCalendar'
import { DailyIssuesResponse } from '../../types/issues'

interface PopularIssuesSectionProps {
  loading: boolean
  dailyIssues: DailyIssuesResponse | null
  activeTab: 'integrated' | 'chartout'
  setActiveTab: (tab: 'integrated' | 'chartout') => void
  currentPage: number
  setCurrentPage: (page: number) => void
  topImageIndex: number
  selectedDate: Date
  onDateChange: (date: Date) => void
  onNavigateToAnalysis: (id: number) => void
}

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=800&auto=format&fit=crop'

const PopularIssuesSection = ({
  loading, dailyIssues, activeTab, setActiveTab, currentPage, setCurrentPage, topImageIndex, selectedDate, onDateChange, onNavigateToAnalysis
}: PopularIssuesSectionProps) => {
  return (
    <div className="w-full md:w-1/2 min-w-0 border-l border-slate-100 pl-4 flex flex-col text-left">
      <div className="flex flex-col mb-4">
        <div className="flex items-center justify-between h-8 mb-4">
          <h2 className="text-slate-800 text-xl font-bold tracking-tight section-highlight">
            {activeTab === 'integrated' ? '언론사 공통으로 다루는 인기 뉴스에요' : '최근에 차트에서 아웃된 이슈들이에요'}
          </h2>
        </div>

        <div className="flex items-center gap-1.5 mb-3 text-[12px] text-slate-500 font-medium opacity-90">
          <span className="material-symbols-outlined text-[14px] text-primary">info</span>
          이곳의 기사들은 이미 초안이 준비되어 있어요. 바로 편집을 시작해 보세요!
        </div>
        <div className="w-full h-px bg-slate-100 mb-2"></div>
        
        <div className="mt-auto pb-2">
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-full w-full border border-slate-200/50 shadow-inner">
            <button 
              onClick={() => setActiveTab('integrated')}
              className={`flex-1 py-2 rounded-full text-[14px] font-medium transition-all duration-300 ${
                activeTab === 'integrated' 
                  ? 'bg-white text-slate-900 font-bold shadow-[2px_4px_12px_rgba(0,0,0,0.15)] border border-slate-100'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-white/50 font-medium'
                }`}
                style={activeTab === 'integrated' ? { textShadow: '0 1px 1px rgba(0,0,0,0.1)' } : {}}
            >
              실시간 통합 순위
            </button>
            <button 
              onClick={() => setActiveTab('chartout')}
              className={`flex-1 py-2 rounded-full text-[14px] font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
                activeTab === 'chartout' 
                  ? 'bg-white text-slate-900 font-bold shadow-[2px_4px_12px_rgba(0,0,0,0.15)] border border-slate-100' 
                  : 'text-slate-500 hover:text-slate-800 hover:bg-white/50 font-medium'
              }`}
              style={activeTab === 'chartout' ? { textShadow: '0 1px 1px rgba(0,0,0,0.1)' } : {}}
            >
              차트아웃
              <span className={`px-1.5 py-0.5 text-[9px] rounded-full font-black animate-pulse ${activeTab === 'chartout' ? 'bg-white text-orange-500' : 'bg-orange-500 text-white'}`}>OUT</span>
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col flex-1">
        {activeTab === 'integrated' ? (
          <div className="divide-y divide-slate-100">
            {loading || !dailyIssues ? (
              <div className="animate-pulse space-y-6">
                <div className="h-[240px] bg-slate-100 rounded-xl w-full" />
                <div className="space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-6 bg-slate-50 rounded w-full" />
                  ))}
                </div>
              </div>
            ) : (
              (() => {
                const year = selectedDate.getFullYear();
                const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
                const day = String(selectedDate.getDate()).padStart(2, '0');
                const dateStr = `${year}-${month}-${day}`;
                
                const issuesForDate = dailyIssues?.data?.[dateStr] || [];
                
                if (issuesForDate.length === 0) {
                  return (
                    <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-3">
                      <span className="material-symbols-outlined text-4xl">event_busy</span>
                      <p className="text-sm font-medium">선택한 날짜({dateStr})에 대한 이슈가 없습니다.</p>
                    </div>
                  );
                }

                const topIssue = issuesForDate[0];
                
                return (
                  <>
                    <div 
                      className="shadow-premium-card p-4 group cursor-pointer w-full mb-6" 
                      onClick={() => onNavigateToAnalysis(topIssue.id)}
                    >
                      <div className="border-t-[3px] border-primary mb-4"></div>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-lg font-bold text-primary flex items-center gap-1 tracking-tight">통합 인기 1위</h4>
                      </div>
                      <div className="pb-4 pt-1 group cursor-pointer border-b border-slate-100">
                        <div className="relative w-full aspect-[21/9] mb-3 overflow-hidden rounded-xl bg-slate-100">
                          {topIssue.image_urls?.map((url, imgIdx) => (
                            <img 
                              key={`${topIssue.id}-${imgIdx}`}
                              alt={topIssue.name} 
                              className={`absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-all duration-1000 ease-in-out ${
                                imgIdx === topImageIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
                              }`} 
                              src={url || DEFAULT_IMAGE}
                              onError={(e) => { (e.target as HTMLImageElement).src = DEFAULT_IMAGE }}
                            />
                          ))}
                          {(topIssue.image_urls?.length === 0 || !topIssue.image_urls) && (
                            <img 
                              alt={topIssue.name} 
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                              src={DEFAULT_IMAGE}
                            />
                          )}
                          <div className="absolute top-2 left-2 size-7 bg-primary text-white flex items-center justify-center font-black rank-number rounded shadow-glow z-10">1</div>
                          <div className="absolute top-2 right-2 px-2.5 py-1 bg-white/90 backdrop-blur-sm border border-primary/20 rounded-lg flex items-center shadow-sm z-10">
                            <span className="text-[10px] font-bold text-slate-700">AI 초안 작성 완료</span>
                          </div>
                        </div>
                        <h5 className="text-[15px] font-bold text-slate-900 leading-snug group-hover:text-primary transition-colors line-clamp-2">
                          {topIssue.name}
                        </h5>
                      </div>
                    </div>
                    
                    <div className="divide-y divide-slate-50 bg-white">
                      {issuesForDate.slice(1, 10).map((issue) => (
                        <div 
                          key={issue.id} 
                          className="py-2.5 group cursor-pointer flex gap-4 items-baseline" 
                          onClick={() => onNavigateToAnalysis(issue.id)}
                        >
                          <span className="rank-number text-xs font-bold text-slate-400 w-4 text-center shrink-0">{issue.rank}</span>
                          <p className="text-[14px] font-medium text-slate-700 truncate flex-1 group-hover:text-primary transition-colors">
                            {issue.name}
                          </p>
                        </div>
                      ))}
                    </div>
                  </>
                );
              })()
            )}
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 flex flex-col h-full">
            {loading || !dailyIssues ? (
              <div className="animate-pulse space-y-6">
                <div className="h-[320px] bg-slate-100 rounded-3xl w-full" />
                <div className="space-y-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-12 bg-slate-50 rounded-xl w-full" />
                  ))}
                </div>
              </div>
            ) : (
              (() => {
                const itemsOnPage1 = 5;
                const itemsOnOtherPages = 10;
                const allChartoutItems: any[] = [];
                
                if (allChartoutItems.length === 0) {
                  return (
                    <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-3">
                      <span className="material-symbols-outlined text-4xl">history_toggle_off</span>
                      <p className="text-sm font-medium text-center px-6">
                        현재 선택한 구조에서는 실시간 통합 순위만 제공됩니다.<br/>
                        차트아웃 데이터는 업데이트 예정입니다.
                      </p>
                    </div>
                  );
                }

                const totalPages = 1 + Math.ceil(Math.max(0, allChartoutItems.length - itemsOnPage1) / itemsOnOtherPages);
                let currentItems;
                if (currentPage === 1) {
                  currentItems = allChartoutItems.slice(0, itemsOnPage1);
                } else {
                  const startIndex = itemsOnPage1 + (currentPage - 2) * itemsOnOtherPages;
                  currentItems = allChartoutItems.slice(startIndex, startIndex + itemsOnOtherPages);
                }

                return (
                  <div className="flex flex-col flex-1 animate-in fade-in slide-in-from-bottom-2 duration-500">
                    <div className="flex-1 flex flex-col min-h-0">
                      {currentPage > 1 && (
                        <div className="mt-4 px-0 py-0 border-t-[3px] border-slate-200 mb-4 shrink-0 text-left">
                          <h3 className="text-[17px] font-bold text-slate-600 flex items-center gap-1 pt-4">
                            차트아웃 목록 <span className="material-symbols-outlined text-sm">chevron_right</span>
                          </h3>
                        </div>
                      )}
                      
                      <div className={`flex-1 ${currentPage === 1 ? 'space-y-3' : 'space-y-0 divide-y divide-slate-50'}`}>
                        {currentItems.map((item, idx) => {
                          const formatTime = (min: number) => min < 60 ? `${min}분 전` : `${Math.floor(min / 60)}시간 전`;
                          
                          return item.is_chart_out && currentPage === 1 && idx === 0 ? (
                            <div key={idx} className="shadow-premium-card p-4 mb-4 transition-all duration-300 group/card cursor-pointer shrink-0" onClick={() => onNavigateToAnalysis(item.id)}>
                              <div className="border-t-[3px] border-slate-200 mb-4"></div>
                              <div className="flex items-center justify-between mb-4">
                                <h3 className="text-[17px] font-bold text-slate-800">최근 차트아웃 이슈</h3>
                              </div>
                              <div className="relative w-full aspect-[21/9] mb-4 overflow-hidden rounded-xl bg-slate-100">
                                <img 
                                  alt={item.name} 
                                  className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-1000" 
                                  src={(item.image_urls?.length ?? 0) > 0 ? item.image_urls[0] : DEFAULT_IMAGE}
                                  onError={(e) => { (e.target as HTMLImageElement).src = DEFAULT_IMAGE }}
                                />
                                <div className="absolute top-2 left-2 px-2 py-1 bg-slate-900/80 backdrop-blur-sm text-white text-[9px] font-black rounded-lg flex items-center justify-center tracking-tighter">OUT</div>
                              </div>
                              <h4 className="text-[17px] font-black text-slate-900 leading-tight mb-2 group-hover/card:text-primary transition-colors break-keep line-clamp-2">
                                {item.name}
                              </h4>
                              <p className="text-[11px] text-slate-400 font-medium">최고 {item.peak_rank}위 / {formatTime(item.chart_out_minutes ?? 0)} 차트아웃</p>
                            </div>
                          ) : (
                            <div key={idx} className={`${currentPage === 1 ? 'py-3 px-1 rounded-xl hover:bg-slate-50 border-b border-slate-50 last:border-0' : 'py-2.5 px-1 hover:bg-slate-50'} flex items-center justify-between transition-all group cursor-pointer shrink-0`} onClick={() => onNavigateToAnalysis(item.id)}>
                              <div className="flex items-center gap-4 flex-1 min-w-0">
                                <span className="px-2 py-0.5 border border-slate-200 text-slate-400 text-[9px] font-black rounded-lg shrink-0 group-hover:border-primary/30 group-hover:text-primary transition-colors">OUT</span>
                                <div className="min-w-0">
                                   <p className="text-[14px] font-bold text-slate-800 truncate mb-1 group-hover:text-primary transition-colors">{item.name}</p>
                                   <p className="text-[11px] text-slate-400 font-medium">최고 {item.peak_rank}위 / {formatTime(item.chart_out_minutes ?? 0)} 차트아웃</p>
                                </div>
                              </div>
                              <span className="material-symbols-outlined text-slate-300 text-[18px] group-hover:text-primary transition-colors">chevron_right</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {totalPages > 1 && (
                      <div className="flex items-center justify-center gap-2 mt-auto pt-6 shrink-0 pb-1">
                        <button 
                          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                          disabled={currentPage === 1}
                          className={`size-8 flex items-center justify-center rounded-lg transition-all ${currentPage === 1 ? 'text-slate-300 cursor-not-allowed' : 'text-slate-500 hover:bg-slate-100'}`}
                        >
                          <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                        </button>
                        {[...Array(totalPages)].map((_, i) => (
                          <button
                            key={i + 1}
                            onClick={() => setCurrentPage(i + 1)}
                            className={`size-8 flex items-center justify-center rounded-lg text-[13px] font-bold transition-all ${
                              currentPage === i + 1 
                                ? 'bg-primary text-white shadow-md shadow-primary/20 scale-110' 
                                : 'text-slate-400 hover:bg-slate-100 hover:text-slate-600'
                            }`}
                          >
                            {i + 1}
                          </button>
                        ))}
                        <button 
                          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                          disabled={currentPage === totalPages}
                          className={`size-8 flex items-center justify-center rounded-lg transition-all ${currentPage === totalPages ? 'text-slate-300 cursor-not-allowed' : 'text-slate-500 hover:bg-slate-100'}`}
                        >
                          <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                        </button>
                      </div>
                    )}
                  </div>
                );
              })()
            )}
          </div>
        )}
      </div>

      <div className="mt-8">
        {/* 필터 및 매체 설정 버튼 제거됨 */}
      </div>
    </div>
  )
}

export default PopularIssuesSection
