import React from 'react'
import SectionHeader from '../ui/SectionHeader'

interface AnalysisHeaderProps {
  title: string
  issueImage: string | null
  mediaRatio: any | null
  handleImageLoad: (e: React.SyntheticEvent<HTMLImageElement>) => void
}

const AnalysisHeader = ({ title, issueImage, mediaRatio, handleImageLoad }: AnalysisHeaderProps) => {
  return (
    <header className="relative mb-2 min-h-[170px] flex items-center overflow-hidden rounded-3xl bg-slate-50 border border-slate-100 shadow-sm">
      {/* 기사 이미지 영역 */}
      <div className={`absolute inset-y-0 right-0 ${mediaRatio ? 'w-[35%]' : 'w-[25%]'} z-0 h-full overflow-hidden`}>
        {issueImage && (
          <img 
            src={issueImage} 
            alt="Issue Visual Context" 
            onLoad={handleImageLoad}
            className="w-full h-full object-cover object-right select-none"
            style={{
              WebkitMaskImage: 'linear-gradient(to right, transparent, black 40%)',
              maskImage: 'linear-gradient(to right, transparent, black 40%)'
            }}
          />
        )}
      </div>

      {/* 타이틀 영역 */}
      <div className="relative z-10 flex flex-col gap-2 w-[55%] px-10 py-6 h-full justify-center">
        <SectionHeader 
          title={title} 
          badge="현재 단계 : 심층 분석"
          align="left"
          titleSize="page"
          className="mb-0 !drop-shadow-none"
        />
      </div>
    </header>
  )
}

export default AnalysisHeader
