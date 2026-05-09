import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'

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
      color: 'bg-white/15'
    },
    { 
      label: '참여 언론사', 
      value: `${stats?.totalPublishers || 12}곳`, 
      icon: 'newspaper',
      color: 'bg-white/15'
    },
    { 
      label: '최근 업데이트', 
      value: `${new Date().getMonth() + 1}/${new Date().getDate()} ${new Date().getHours()}시`, 
      icon: 'update',
      color: 'bg-white/15'
    }
  ];

  // 퍼지듯이 나타나는 부드러운 트랜지션 애니메이션 설정
  const fadeScaleVariant = {
    initial: { opacity: 0, scale: 0.95, filter: 'blur(4px)' },
    animate: { opacity: 1, scale: 1, filter: 'blur(0px)' },
    exit: { opacity: 0, scale: 1.05, filter: 'blur(4px)' },
    transition: { duration: 0.15, ease: 'easeOut' as const }
  };

  return (
    <section className="bg-primary w-full flex flex-col items-center shadow-md relative z-10 pt-8 lg:pt-0">
      <div className="max-w-[1280px] w-full px-4 xl:px-6 flex flex-col lg:flex-row items-center lg:items-end justify-between lg:h-[130px] xl:h-[160px]">
        
        {/* 1. 좌측 홍보 문구 */}
        <div className="flex-1 pb-4 lg:pb-6 xl:pb-8 text-center lg:text-left w-full flex flex-col items-center lg:items-start">
          <AnimatePresence mode="wait">
            <motion.h2 
              key={isEditorial ? 'editorial-title' : 'politics-title'}
              {...fadeScaleVariant}
              className="flex flex-col items-center lg:items-start break-keep"
            >
              <span className="bg-white text-slate-900 text-xl sm:text-2xl lg:text-[22px] xl:text-[28px] font-bold px-3 py-1.5 mb-2 xl:mb-3 leading-tight tracking-tight shadow-sm">
                {isEditorial ? '원하는 주제를 골라주세요' : '지금 가장 뜨거운 이슈'}
              </span>
              <span className="text-white text-base sm:text-lg lg:text-[19px] xl:text-[22px] font-light opacity-95 tracking-tight mt-0.5">
                {isEditorial ? '초안부터 검토까지 한번에' : '실시간 미디어 트렌드를 확인하세요'}
              </span>
            </motion.h2>
          </AnimatePresence>
        </div>

        {/* 2. 우측 영역 (이슈 탐색 모드: 통계 / 사설 모드: 프로세스) */}
        <div className="flex items-center justify-center lg:justify-end relative h-full pb-6 lg:pb-0 min-h-[90px] xl:min-h-[110px]">
          <AnimatePresence mode="wait">
            {!isEditorial ? (
              // [최신 이슈 모드] 실시간 통계 UI
              <motion.div 
                key="stats-ui"
                {...fadeScaleVariant}
                className="flex flex-wrap items-center justify-center lg:justify-end gap-x-4 sm:gap-x-6 xl:gap-x-8 gap-y-4"
              >
                {statItems.map((stat, idx) => (
                  <div key={idx} className="flex items-center gap-3 px-4 py-2 xl:py-2.5 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 min-w-[140px] xl:min-w-[160px] group hover:bg-white/15 transition-all">
                    <div className={`size-10 xl:size-11 rounded-xl ${stat.color} flex items-center justify-center`}>
                      <span className={`material-symbols-outlined text-white text-[22px] xl:text-[24px]`}>
                        {stat.icon}
                      </span>
                    </div>
                    <div className="flex flex-col flex-1 items-end">
                      <span className="text-[11px] xl:text-[12px] font-light text-white uppercase tracking-wider">{stat.label}</span>
                      <span className="text-[16px] xl:text-[18px] font-medium text-white leading-none mt-1">{stat.value}</span>
                    </div>
                  </div>
                ))}
              </motion.div>
            ) : (
              // [사설/컬럼 모드] 기존 프로세스 안내 UI
              <motion.div 
                key="process-ui"
                {...fadeScaleVariant}
                className="flex flex-wrap items-center justify-center lg:justify-end gap-x-4 sm:gap-x-6 xl:gap-x-8 gap-y-4"
              >
                {[
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
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}

export default MainHero
