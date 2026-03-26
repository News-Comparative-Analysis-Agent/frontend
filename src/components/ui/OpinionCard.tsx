import React from 'react'
import StanceBadge from './StanceBadge'

interface OpinionCardProps {
  media: string
  color?: 'indigo' | 'violet' | 'emerald' | 'cyan' | 'slate'
  title: string
  analysisTitle: string
  description: string
  sources: { title: string; url: string }[]
}

/**
 * 기사 분석 페이지에서 사용되는 개별 의견 카드 컴포넌트입니다.
 * StanceBadge와 연동되어 일관된 디자인을 유지합니다.
 */
const OpinionCard = ({ media, color = 'slate', title, analysisTitle, description, sources }: OpinionCardProps) => {
  const innerBoxStyles = {
    indigo: 'bg-indigo-50/40 border-indigo-100',
    violet: 'bg-violet-50/40 border-violet-100',
    emerald: 'bg-emerald-50/40 border-emerald-100',
    cyan: 'bg-cyan-50/40 border-cyan-100',
    slate: 'bg-slate-50/40 border-slate-100',
  }

  return (
    <div className="opinion-card transition-all duration-300">
      <StanceBadge color={color}>
        {media}
      </StanceBadge>
      <h4 className="text-[20px] font-bold text-slate-900 leading-[1.3] mb-6" dangerouslySetInnerHTML={{ __html: title }}></h4>
      <div className={`inner-analysis-box ${innerBoxStyles[color]}`}>
        <div className="font-bold text-slate-900 text-[16px] mb-2">{analysisTitle}</div>
        <p className="text-[15px] text-slate-600 leading-relaxed font-medium">{description}</p>
      </div>
      <details className="notion-toggle w-full">
        <summary className="notion-toggle-header">
          <span className="material-symbols-outlined toggle-icon text-[16px]">chevron_right</span>
          <span>관련 원문 기사</span>
        </summary>
        <div className="notion-toggle-content px-2">
          {sources.map((source, idx) => (
            <a 
              key={idx} 
              className="source-link group/link flex items-center gap-2 p-3 rounded-xl bg-slate-50 border border-slate-100 hover:bg-white hover:border-primary/30 transition-all mb-2" 
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="text-[13.5px] font-bold text-slate-700 flex-1 truncate group-hover/link:text-primary transition-colors">{source.title}</span>
              <span className="material-symbols-outlined text-[16px] text-slate-400 group-hover/link:text-primary">open_in_new</span>
            </a>
          ))}
        </div>
      </details>
    </div>
  )
}

export default OpinionCard
