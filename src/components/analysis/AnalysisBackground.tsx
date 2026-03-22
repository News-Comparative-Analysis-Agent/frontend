import React from 'react'

interface AnalysisBackgroundProps {
  description: string
  background?: string
  coreContentions?: string
  mediaRatio: any | null
}

const AnalysisBackground = ({ description, background, coreContentions, mediaRatio }: AnalysisBackgroundProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-2">
      <div className={`bg-white border border-slate-100 rounded-[32px] p-8 shadow-premium ${mediaRatio ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
        <div className="flex items-center gap-3 mb-6">
          <div className="flex items-center justify-center size-8 bg-primary rounded-full shadow-sm shadow-primary/20">
            <span className="material-symbols-outlined text-[18px] text-white">subject</span>
          </div>
          <h3 className="text-[20px] font-bold text-slate-900">이슈 배경 상세</h3>
        </div>
        
        <div className="space-y-4 pr-6">
          <div className="bullet-point">
            <div className="bullet-dot"></div>
            <p className="text-[15px] text-slate-600 leading-relaxed font-medium">{description}</p>
          </div>
          {background && (
            <div className="bullet-point">
              <div className="bullet-dot"></div>
              <p className="text-[15px] text-slate-600 leading-relaxed font-medium">{background}</p>
            </div>
          )}
          {coreContentions && (
            <div className="bullet-point">
              <div className="bullet-dot"></div>
              <p className="text-[15px] text-slate-600 leading-relaxed font-medium">{coreContentions}</p>
            </div>
          )}
        </div>
      </div>

      {/* 신규 기능을 위한 예약용 빈 영역 (플레이스홀더) */}
      <div className="lg:col-span-1 bg-white border border-slate-100 border-dashed rounded-[32px] p-8 shadow-sm flex flex-col items-center justify-center group hover:border-primary/30 transition-colors">
        <div className="text-center opacity-30 group-hover:opacity-50 transition-opacity">
          <span className="material-symbols-outlined text-[40px] mb-3 text-slate-400">add_circle</span>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">New Feature Area</p>
          <p className="text-[11px] text-slate-300 mt-1">추후 기능 탑재 예정</p>
        </div>
      </div>
      
      {mediaRatio && (
        <div className="lg:col-span-1 bg-white border border-slate-100 rounded-[32px] p-8 shadow-premium flex flex-col items-center justify-center">
           <div className="text-center">
             <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">MEDIA RATIO</p>
             <div className="relative size-32 mb-4">
               <div className="absolute inset-0 rounded-full border-[10px] border-slate-100"></div>
               <div className="absolute inset-0 rounded-full border-[10px] border-primary border-r-transparent border-b-transparent rotate-45"></div>
             </div>
             <p className="text-sm font-bold text-slate-800">{mediaRatio}</p>
           </div>
        </div>
      )}
    </div>
  )
}

export default AnalysisBackground
