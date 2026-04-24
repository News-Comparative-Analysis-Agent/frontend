import React from 'react'

const MainHero = () => {
  return (
    <section className="bg-primary w-full flex flex-col items-center shadow-md relative z-10 pt-8 lg:pt-0">
      <div className="max-w-[1280px] w-full px-6 flex flex-col lg:flex-row items-center lg:items-end justify-between lg:h-[160px]">
        
        {/* 1. 좌측 홍보 문구 (모바일 중앙 정렬 대응) */}
        <div className="flex-1 pb-4 lg:pb-8 text-center lg:text-left">
          <h2 className="flex flex-col items-start break-keep">
            <span className="bg-white text-slate-900 text-2xl sm:text-3xl lg:text-[30px] font-black px-2 py-1 mb-2 leading-tight">
              더 쉽고 빠른 기사 작성,
            </span>
            <span className="text-white text-lg sm:text-xl lg:text-[22px] font-light opacity-90 tracking-tight">
              시작부터 완성까지 함께해요
            </span>
          </h2>
        </div>

        {/* 2. 우측 프로세스 영역 (모바일 줄바꿈 및 간격 최적화) */}
        <div className="flex flex-wrap items-center justify-center lg:justify-end gap-x-4 sm:gap-x-9 gap-y-6 relative h-full pb-8 lg:pb-0">
          {[
            { num: '01', label: '주제 선택', desc: '원하는 주제를 선택하세요.' },
            { num: '02', label: '심층 분석', desc: '언론사 별 관점을 분석하세요.' },
            { num: '03', label: '초안 작성', desc: 'AI가 초안을 작성합니다.' },
            { num: '04', label: '최종 검토', desc: '기사 품질을 검토하세요.' }
          ].map((step, idx) => (
            <div key={idx} className="flex flex-col items-center text-center group min-w-[110px]">
              {/* 🎯 숫자 영역 (주황 배경에 맞춘 대비 조정) */}
              <div className={`relative flex items-center justify-center mb-1 transition-all duration-300 ${idx === 0 ? 'bg-white rounded-full shadow-lg w-[52px] h-[52px]' : 'w-[80px] h-[48px] translate-y-[3px]'}`}>
                <span className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[52px] font-black select-none -z-10 ${idx === 0 ? 'text-primary/10' : 'text-white/10'}`}>
                  {step.num}
                </span>
                <span className={`font-black tracking-tighter leading-none transition-all duration-500 ${idx === 0 ? 'text-primary text-[22px]' : 'text-white/90 text-[26px]'}`}>
                  {step.num}
                </span>
              </div>

              <div className="flex flex-col gap-0 transition-transform duration-300">
                <p className={`text-[14px] font-bold tracking-tight whitespace-nowrap mt-1 ${idx === 0 ? 'text-white' : 'text-white/80'}`}>{step.label}</p>
                <p className={`text-[11px] font-normal leading-tight whitespace-nowrap ${idx === 0 ? 'text-white/90' : 'text-white/60'}`}>{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default MainHero
