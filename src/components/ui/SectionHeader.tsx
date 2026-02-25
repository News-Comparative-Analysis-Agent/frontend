import React from 'react'

interface SectionHeaderProps {
  icon?: string
  title: string
  description?: string
  badge?: string
  className?: string
  align?: 'left' | 'center'
  titleSize?: 'sm' | 'section' | 'page'
}

/**
 * 섹션의 제목을 나타내는 공통 헤더 컴포넌트입니다.
 * 아이콘, 제목, 설명, 뱃지 등 일관된 레이아웃을 제공합니다.
 */
const SectionHeader = ({ 
  icon,   
  title, 
  description, 
  className = '', 
  align = 'left',
  titleSize = 'section'
}: SectionHeaderProps) => {
  const isCenter = align === 'center'
  const isPageTitle = titleSize === 'page'

  return (
    <header className={`${isCenter ? 'text-center' : 'text-left'} ${className}`}>
      <div className={`flex items-center gap-2.5 ${isCenter ? 'justify-center' : ''} ${description ? 'mb-2' : ''}`}>
        {icon && <span className="material-symbols-outlined text-primary text-[28px] font-bold">{icon}</span>}
        <h2 className={`${
          isPageTitle ? 'text-[24px] md:text-[30px]' 
          : titleSize === 'sm' ? 'text-base'
          : 'text-xl'
        } font-black text-slate-900 tracking-tight leading-tight`}>{title}</h2>
      </div>
      {description && (
        <div className={`flex items-center gap-2 ${isCenter ? 'justify-center' : ''} pl-0`}>
          {!isCenter && <div className="size-1.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)] ml-1"></div>}
          <p className="text-[13px] text-slate-400 font-medium">{description}</p>
        </div>
      )}
    </header>
  )
}

export default SectionHeader
