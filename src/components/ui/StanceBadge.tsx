import React from 'react'

interface StanceBadgeProps {
  stance: 'progressive' | 'neutral' | 'conservative'
  children: React.ReactNode
  className?: string
}

const stanceStyles = {
  progressive: 'text-progressive border-blue-100 bg-blue-50',
  neutral: 'text-slate-600 border-slate-200 bg-slate-50',
  conservative: 'text-conservative border-red-100 bg-red-50',
}

/**
 * 언론사의 정치적 성향을 나타내는 뱃지 컴포넌트입니다.
 * 디자인은 기존의 .media-badge 클래스를 기반으로 하며, 성향에 따라 색상이 자동으로 적용됩니다.
 */
const StanceBadge = ({ stance, children, className = '' }: StanceBadgeProps) => {
  const stanceClass = stanceStyles[stance] || stanceStyles.neutral

  return (
    <div className={`media-badge ${stanceClass} ${className}`}>
      {children}
    </div>
  )
}

export default StanceBadge
