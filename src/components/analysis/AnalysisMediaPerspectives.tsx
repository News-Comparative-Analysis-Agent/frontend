import React from 'react'
import OpinionCard from '../ui/OpinionCard'

interface AnalysisMediaPerspectivesProps {
  activeMedia: string
  setActiveMedia: (media: string) => void
  uniqueMediaList: string[]
  flattenedOpinions: any[]
}

const AnalysisMediaPerspectives = ({ 
  activeMedia, 
  setActiveMedia, 
  uniqueMediaList, 
  flattenedOpinions 
}: AnalysisMediaPerspectivesProps) => {
  return (
    <section className="mb-2">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between bg-[#F9FAFB] border border-slate-100 rounded-3xl px-8 py-4 mb-2 gap-8 shadow-sm">
        <div className="flex flex-col gap-1 text-left flex-1">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center size-8 bg-primary rounded-xl shadow-lg shadow-primary/20">
              <span className="material-symbols-outlined text-[18px] text-white">newspaper</span>
            </div>
            <h3 className="text-[20px] font-bold text-slate-900 tracking-tight whitespace-nowrap">언론사별 주요 논조</h3>
          </div>
          <div className="pl-11">
            <p className="text-[14px] text-slate-500 leading-relaxed font-medium">
              원하는 언론사의 관점만 골라보세요.
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-full border border-slate-200/50 shadow-inner shrink-0 no-scrollbar overflow-x-auto">
          <button
            onClick={() => setActiveMedia('all')}
            className={`px-5 py-2 rounded-full text-[14px] transition-all duration-300 whitespace-nowrap ${
              activeMedia === 'all'
                ? 'bg-white text-slate-900 font-bold shadow-[2px_4px_12px_rgba(0,0,0,0.15)] border border-slate-100'
                : 'text-slate-500 hover:text-slate-800 hover:bg-white/50 font-medium'
            }`}
            style={activeMedia === 'all' ? { textShadow: '0 1px 1px rgba(0,0,0,0.1)' } : {}}
          >
            전체
          </button>
          {uniqueMediaList.map(media => (
            <button
              key={media}
              onClick={() => setActiveMedia(media)}
              className={`px-5 py-2 rounded-full text-[14px] transition-all duration-300 whitespace-nowrap ${
                activeMedia === media
                  ? 'bg-white text-slate-900 font-bold shadow-[2px_4px_12px_rgba(0,0,0,0.15)] border border-slate-100'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-white/50 font-medium'
              }`}
              style={activeMedia === media ? { textShadow: '0 1px 1px rgba(0,0,0,0.1)' } : {}}
            >
              {media}
            </button>
          ))}
        </div>
      </div>

      <div className="relative group">
        <div className="flex gap-6 overflow-x-auto pb-8 pt-0 no-scrollbar scroll-smooth">
          {flattenedOpinions.filter(o => activeMedia === 'all' || o.media === activeMedia).map((o, idx) => (
            <div key={`${o.media}-${idx}`} className="min-w-[380px] w-[380px] md:min-w-[420px] md:w-[420px] flex-shrink-0">
              <OpinionCard 
                media={o.media}
                color={o.color}
                title={o.title}
                analysisTitle={o.analysisTitle}
                description={o.description}
                sources={o.sources}
              />
            </div>
          ))}
          {flattenedOpinions.length === 0 && (
             <div className="w-full h-40 flex items-center justify-center text-slate-400 font-medium">
               해당 언론사의 분석 기사가 없습니다.
             </div>
          )}
          <div className="min-w-[100px] shrink-0"></div>
        </div>
        
        <div className="absolute top-0 right-0 h-full w-32 bg-gradient-to-l from-slate-50/0 via-slate-50/40 to-transparent pointer-events-none z-10 opacity-100 group-hover:opacity-0 transition-opacity"></div>
        
        <div className="absolute right-6 top-1/2 -translate-y-1/2 z-20 pointer-events-none animate-bounce flex flex-col items-center gap-2 text-primary opacity-80 group-hover:opacity-0 transition-opacity">
          <span className="material-symbols-outlined text-[32px] bg-white/80 rounded-full shadow-lg p-2">arrow_forward_ios</span>
          <span className="text-[11px] font-black bg-white/80 px-2 py-0.5 rounded shadow-sm">옆으로 넘겨보세요</span>
        </div>
      </div>
    </section>
  )
}

export default AnalysisMediaPerspectives
