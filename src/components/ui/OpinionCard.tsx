import React from 'react'
import StanceBadge from './StanceBadge'

interface OpinionCardProps {
  media: string
  stance: 'progressive' | 'neutral' | 'conservative'
  score: number
  title: string
  analysisTitle: string
  description: string
  sources: string[]
}

/**
 * 기사 분석 페이지에서 사용되는 개별 의견 카드 컴포넌트입니다.
 * StanceBadge와 연동되어 일관된 디자인을 유지합니다.
 */
const OpinionCard = ({ media, stance, score, title, analysisTitle, description, sources }: OpinionCardProps) => {
  const innerBoxStyles = {
    progressive: 'bg-blue-50/50 border-blue-100',
    neutral: 'bg-slate-50 border-slate-200',
    conservative: 'bg-red-50/50 border-red-100',
  }

  // Calculate marker position (0 to 100%)
  // Score is -5 to 5, so width is 10. (score + 5) / 10 * 100
  const markerPosition = ((score + 5) / 10) * 100;

  return (
    <div className="card-premium horizontal-scroll-item w-[320px] md:w-[380px] flex flex-col p-6 transition-all duration-300 hover:shadow-xl group">
      <div className="flex items-center justify-between mb-2">
        <StanceBadge stance={stance}>
          {media}
        </StanceBadge>
        <div className={`size-2 rounded-full ${stance === 'progressive' ? 'bg-blue-400' : stance === 'conservative' ? 'bg-red-400' : 'bg-slate-300'}`}></div>
      </div>

      {/* Stance Score Visualization */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-1.5 h-4">
          <span className="text-[10px] font-black text-blue-500/60 uppercase">진보</span>
          <div className="flex items-center gap-1">
            <span className="text-[11px] font-black text-slate-900">{score > 0 ? `+${score}` : score}</span>
          </div>
          <span className="text-[10px] font-black text-red-500/60 uppercase">보수</span>
        </div>
        <div className="relative h-1.5 w-full bg-slate-100 rounded-full overflow-visible border border-slate-200/50">
          {/* Central Neutral marker */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-0.5 h-3 bg-slate-200"></div>
          
          {/* Stance Indicator Marker */}
          <div 
            className={`absolute top-1/2 -translate-y-1/2 size-3.5 rounded-full border-2 border-white shadow-md transition-all duration-1000 z-10 ${
              stance === 'progressive' ? 'bg-blue-500' : stance === 'conservative' ? 'bg-red-500' : 'bg-slate-400'
            }`}
            style={{ left: `calc(${markerPosition}% - 7px)` }}
          ></div>

          {/* Background fill to center (optional but looks nice) */}
          <div 
            className={`absolute top-0 h-full opacity-20 transition-all duration-1000 ${
              score < 0 ? 'bg-blue-500 right-1/2' : 'bg-red-500 left-1/2'
            }`}
            style={{ width: `${Math.abs(markerPosition - 50)}%` }}
          ></div>
        </div>
      </div>
      
      <div className="flex-1">
        <h4 className="text-[18px] font-bold text-slate-900 leading-[1.4] mb-5 group-hover:text-primary transition-colors" dangerouslySetInnerHTML={{ __html: title }}></h4>
        <div className={`p-4 rounded-xl border-l-4 ${innerBoxStyles[stance]} mb-6`}>
          <div className="font-bold text-slate-900 text-[15px] mb-2 flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">analytics</span>
            {analysisTitle}
          </div>
          <p className="text-[14px] text-slate-600 leading-relaxed font-medium line-clamp-3">{description}</p>
        </div>
      </div>

      <details className="notion-toggle w-full pt-4 border-t border-slate-50">
        <summary className="notion-toggle-header py-1">
          <span className="material-symbols-outlined toggle-icon text-[18px]">chevron_right</span>
          <span className="text-[13px] font-bold text-slate-500">관련 원문 리스트</span>
        </summary>
        <div className="notion-toggle-content pt-2 space-y-1">
          {sources.map((source, idx) => (
            <a key={idx} className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 transition-colors" href="#">
              <span className="text-[12px] font-semibold text-slate-600 truncate flex-1">{source}</span>
              <span className="material-symbols-outlined text-[14px] text-slate-300">open_in_new</span>
            </a>
          ))}
        </div>
      </details>
    </div>
  )
}

export default OpinionCard
