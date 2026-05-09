import React from 'react'

interface MainHeroProps {
  activeIssueType: 'politics' | 'editorial'
  stats?: {
    totalArticles: number
    totalIssues: number
    totalPublishers: number
  }
}

const MainHero = ({ activeIssueType, stats }: MainHeroProps) => {
  const isEditorial = activeIssueType === 'editorial';

  const statItems = [
    { 
      label: '오늘 수집된 기사', 
      value: `${stats?.totalArticles || 0}건`, 
      icon: 'article',
      color: 'bg-blue-400/20'
    },
    { 
      label: '참여 언론사', 
      value: `${stats?.totalPublishers || 12}곳`, 
      icon: 'newspaper',
      color: 'bg-amber-400/20'
    },
    { 
      label: '최근 업데이트', 
      value: `${new Date().getMonth() + 1}/${new Date().getDate()} ${new Date().getHours()}시`, 
      icon: 'update',
      color: 'bg-emerald-400/20'
    }
  ];

  return (
    <section className="bg-primary w-full flex flex-col items-center shadow-md relative z-10 pt-8 lg:pt-0">
      <div className="max-w-[1280px] w-full px-4 xl:px-6 flex flex-col lg:flex-row items-center lg:items-end justify-between lg:h-[130px] xl:h-[160px]">
        
        {/* 1. 좌측 홍보 문구 */}
        <div className="flex-1 pb-4 lg:pb-6 xl:pb-8 text-center lg:text-left w-full flex flex-col items-center lg:items-start">
          <h2 className="flex flex-col items-center lg:items-start break-keep">
            <span className="bg-white text-slate-900 text-xl sm:text-2xl lg:text-[20px] xl:text-[24px] font-bold px-2 py-1 mb-1.5 xl:mb-2 leading-tight">
              {isEditorial ? '원하는 주제를 골라주세요' : '지금 가장 뜨거운 이슈'}
            </span>
            <span className="text-white text-base sm:text-lg lg:text-[17px] xl:text-[20px] font-light opacity-90 tracking-tight">
              {isEditorial ? '초안부터 검토까지 한번에' : '실시간 미디어 트렌드를 확인하세요'}
            </span>
          </h2>
        </div>

        {/* 2. 우측 영역 (이슈 탐색 모드: 통계 / 사설 모드: 프로세스) */}
        <div className="flex flex-wrap items-center justify-center lg:justify-end gap-x-4 sm:gap-x-6 xl:gap-x-8 gap-y-4 relative h-full pb-6 lg:pb-0">
          {!isEditorial ? (
            // [최신 이슈 모드] 실시간 통계 UI
            statItems.map((stat, idx) => (
              <div key={idx} className="flex items-center gap-3 px-4 py-2 xl:py-2.5 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 min-w-[140px] xl:min-w-[160px] group hover:bg-white/15 transition-all">
                <div className={`size-10 xl:size-11 rounded-xl ${stat.color} flex items-center justify-center`}>
                  <span className={`material-symbols-outlined text-white text-[22px] xl:text-[24px] ${stat.isAnimating ? 'animate-spin' : ''}`}>
                    {stat.icon}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] xl:text-[11px] font-light text-white/70 uppercase tracking-wider">{stat.label}</span>
                  <span className="text-[16px] xl:text-[18px] font-medium text-white leading-none mt-0.5">{stat.value}</span>
                </div>
              </div>
            ))
          ) : (
            // [사설/컬럼 모드] 기존 프로세스 안내 UI
            [
              { num: '01', label: '주제 선택', desc: '작성 주제 선택' },
              { num: '02', label: '심층 분석', desc: '언론사별 관점 비교' },
              { num: '03', label: '초안 작성', desc: 'AI초안 자동 생성' },
              { num: '04', label: '최종 검토', desc: '기사 품질 최종검토' }
            ].map((step, idx) => (
              <div key={idx} className="flex flex-col items-center text-center group min-w-[80px] xl:min-w-[110px]">
                <div className={`relative flex items-center justify-center mb-1 transition-all duration-300 ${idx === 0 ? 'bg-white rounded-full shadow-lg w-[40px] h-[40px] xl:w-[52px] xl:h-[52px]' : 'w-[60px] h-[38px] xl:w-[80px] xl:h-[48px] translate-y-[3px]'}`}>
                  <span className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[38px] xl:text-[52px] font-black select-none -z-10 ${idx === 0 ? 'text-primary/10' : 'text-white/10'}`}>
                    {step.num}
                  </span>
                  <span className={`font-black tracking-tighter leading-none transition-all duration-500 ${idx === 0 ? 'text-primary text-[16px] xl:text-[22px]' : 'text-white/90 text-[20px] xl:text-[26px]'}`}>
                    {step.num}
                  </span>
                </div>
                <div className="flex flex-col gap-0">
                  <p className={`text-[11px] xl:text-[14px] font-bold tracking-tight whitespace-nowrap mt-1 ${idx === 0 ? 'text-white' : 'text-white/80'}`}>{step.label}</p>
                  <p className={`text-[9px] xl:text-[11px] font-normal leading-tight whitespace-nowrap ${idx === 0 ? 'text-white/90' : 'text-white/60'}`}>{step.desc}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  )
}

export default MainHero
