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
  badge, 
  className = '', 
  align = 'left',
  titleSize = 'section'
}: SectionHeaderProps) => {
  const isCenter = align === 'center'
  const isPageTitle = titleSize === 'page'

  return (
    <header className={`${isCenter ? 'text-center' : 'text-left'} ${className}`}>
      {badge && (
        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 text-primary text-[12px] font-bold mb-5 border border-primary/10 ${isCenter ? 'mx-auto' : ''}`}>
          <span className="material-symbols-outlined text-[15px]">info</span>
          {badge}
        </div>
      )}
      <div className={`flex items-center gap-2 ${isCenter ? 'justify-center' : ''} ${description ? 'mb-1' : ''}`}>
        {icon && (
          <div className="w-8 shrink-0 flex items-center justify-center">
            {icon === 'pulse_dot' ? (
              <div className="size-3 rounded-full bg-primary animate-pulse shadow-[0_0_12px_rgba(var(--primary),0.8)] relative after:absolute after:inset-0 after:rounded-full after:animate-ping after:bg-primary/40"></div>
            ) : (
              <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-[18px] font-bold">{icon}</span>
              </div>
            )}
          </div>
        )}
        <h2 className={`${
          isPageTitle ? 'text-[20px] md:text-[26px]' 
          : titleSize === 'sm' ? 'text-[14px]'
          : 'text-[20px]'
        } font-bold text-slate-900 tracking-tight leading-tight`}>{title}</h2>
      </div>
      {description && (
        <div className={`flex items-center gap-2 ${isCenter ? 'justify-center' : ''}`}>
          <div className="w-8 shrink-0 flex items-center justify-center">
            {!isCenter && <div className="size-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>}
          </div>
          <p className="text-[12px] text-slate-400 font-medium leading-relaxed">{description}</p>
        </div>
      )}
    </header>
  )
}

export default SectionHeader
