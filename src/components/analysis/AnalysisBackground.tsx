import { TimelineItem } from '../../types/models/analysis'

interface AnalysisBackgroundProps {
  description: string
  background?: string
  coreContentions?: string
  mediaRatio: any | null
  timeline?: TimelineItem[]
}

const AnalysisBackground = ({ description, background, coreContentions, mediaRatio, timeline }: AnalysisBackgroundProps) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-2 items-stretch">
      <div className="flex-1 bg-white border border-slate-100 rounded-[32px] p-6 shadow-premium min-w-0">
        <div className="flex items-center gap-3 mb-8">
          <div className="flex items-center justify-center size-8 bg-primary rounded-full shadow-sm shadow-primary/20">
            <span className="material-symbols-outlined text-[18px] text-white">subject</span>
          </div>
          <h3 className="text-[20px] font-bold text-slate-900">이슈 배경 상세</h3>
        </div>
        
        <div className="pr-2 pt-1">
          <div className="bullet-point min-h-[85px]">
            <div className="bullet-dot mt-2"></div>
            <p className="text-[15px] text-slate-600 leading-relaxed font-medium mt-0.5">{description}</p>
          </div>
          {background && (
            <div className="bullet-point min-h-[85px]">
              <div className="bullet-dot mt-2"></div>
              <p className="text-[15px] text-slate-600 leading-relaxed font-medium mt-0.5">{background}</p>
            </div>
          )}
          {coreContentions && (
            <div className="bullet-point min-h-[85px]">
              <div className="bullet-dot mt-2"></div>
              <p className="text-[15px] text-slate-600 leading-relaxed font-medium mt-0.5">{coreContentions}</p>
            </div>
          )}
        </div>
      </div>

      {/* 이슈 타임라인 영역 - 하단 논조 카드와 동일한 420px 너비 적용 */}
      <div className="w-full md:w-[380px] lg:w-[420px] shrink-0 bg-white border border-slate-100 rounded-[32px] p-6 shadow-premium">
        <div className="flex items-center gap-3 mb-8">
          <div className="flex items-center justify-center size-8 bg-primary rounded-full shadow-sm shadow-primary/20">
            <span className="material-symbols-outlined text-[18px] text-white">calendar_today</span>
          </div>
          <h3 className="text-[20px] font-bold text-slate-900">이슈 타임라인</h3>
        </div>
        
        <div className="relative pl-1 pt-1">
          {/* Vertical Line */}
          <div className="absolute left-[12px] top-6 bottom-8 w-0.5 bg-slate-100"></div>
          
          {timeline?.map((item, idx) => (
            <div key={idx} className="relative pl-9 group/time min-h-[85px]">
              {/* Node Circle */}
              <div className={`absolute left-0 top-1.5 size-[18px] rounded-full border-[3px] border-white shadow-md z-10 transition-all duration-300 ${
                item.isCurrent 
                  ? 'bg-primary scale-110 ring-4 ring-primary/10' 
                  : 'bg-slate-200 ring-4 ring-slate-50 group-hover/time:bg-slate-300'
              }`}></div>
              
              <div className="flex flex-col gap-1.5 -mt-0.5 pb-4">
                <span className={`text-[12px] font-bold tracking-tight transition-colors ${
                  item.isCurrent ? 'text-primary' : 'text-slate-300'
                }`}>
                  {item.date}
                </span>
                <p className={`text-[15px] leading-relaxed transition-colors font-medium ${
                  item.isCurrent ? 'text-slate-800' : 'text-slate-400'
                }`}>
                  {item.content}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {mediaRatio && (
        <div className="w-full md:w-[220px] lg:w-[240px] shrink-0 bg-white border border-slate-100 rounded-[32px] p-6 shadow-premium flex flex-col items-center justify-center">
           <div className="text-center">
             <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">MEDIA RATIO</p>
             <div className="relative size-24 mb-4 mx-auto">
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
