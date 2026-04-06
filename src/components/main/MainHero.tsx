import React from 'react'

const MainHero = () => {
  return (
    <section className="bg-primary min-h-[200px] py-8 md:py-0 md:h-[220px] flex flex-col justify-center relative z-10 hero-depth-shadow">
      <div className="max-w-[1400px] w-full mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12 lg:gap-24">
        <div className="flex-1 text-center md:text-left shrink-0">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-[1.3] break-keep">
            기사 작성의 모든 과정,<br className="hidden sm:block" /> 실시간으로 도와드립니다.
          </h2>
        </div>
        <div className="flex flex-row items-center gap-3 sm:gap-6 py-2 md:py-6 flex-[2] w-full md:w-auto">
          <div className="flex flex-col items-start gap-2 flex-1 relative">
            <span className="flex items-center justify-center size-14 rounded-full bg-white text-primary text-2xl font-black shadow-glow ring-4 ring-white/30 shrink-0">1</span>
            <div className="text-left">
              <p className="text-[18px] font-black text-white leading-none">주제 선택</p>
               <p className="text-[13px] text-white mt-1.5 leading-snug font-medium opacity-90">주제를 선택하거나 검색해 보세요.</p>
            </div>
          </div>
          <div className="flex flex-col items-start gap-3 flex-1 mt-2 opacity-70">
            <span className="flex items-center justify-center size-10 rounded-full bg-white/20 text-white text-lg font-bold border border-white/30 shrink-0">2</span>
            <div className="text-left">
              <p className="text-[16px] font-bold text-white leading-none">심층 분석</p>
              <p className="text-[12px] text-white/80 mt-2 leading-snug font-normal">진보/보수 관점을 비교 분석합니다.</p>
            </div>
          </div>
          <div className="flex flex-col items-start gap-3 flex-1 mt-2 opacity-70">
            <span className="flex items-center justify-center size-10 rounded-full bg-white/20 text-white text-lg font-bold border border-white/30 shrink-0">3</span>
            <div className="text-left">
              <p className="text-[16px] font-bold text-white leading-none">초안 작성</p>
              <p className="text-[12px] text-white/80 mt-2 leading-snug font-normal">AI가 기사 초안을 작성합니다.</p>
            </div>
          </div>
          <div className="flex flex-col items-start gap-3 flex-1 mt-2 opacity-70 -ml-6">
            <span className="flex items-center justify-center size-10 rounded-full bg-white/20 text-white text-lg font-bold border border-white/30 shrink-0">4</span>
            <div className="text-left">
               <p className="text-[16px] font-bold text-white leading-none">최종 검토</p>
              <p className="text-[12px] text-white/80 mt-2 leading-snug font-normal">기사 품질 검토 후 발행합니다.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default MainHero
