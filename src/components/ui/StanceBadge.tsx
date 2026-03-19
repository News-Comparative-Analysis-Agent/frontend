import React from 'react'

interface StanceBadgeProps {
  color?: 'indigo' | 'violet' | 'emerald' | 'cyan' | 'slate'
  children: React.ReactNode
  className?: string
}

const colorStyles = {
  indigo: 'text-indigo-600 border-indigo-100 bg-indigo-50',
  violet: 'text-violet-600 border-violet-100 bg-violet-50',
  emerald: 'text-emerald-600 border-emerald-100 bg-emerald-50',
  cyan: 'text-cyan-600 border-cyan-100 bg-cyan-50',
  slate: 'text-slate-600 border-slate-100 bg-slate-50',
}

/**
 * 언론사의 정치적 성향을 나타내는 뱃지 컴포넌트입니다.
 * 디자인은 기존의 .media-badge 클래스를 기반으로 하며, 성향에 따라 색상이 자동으로 적용됩니다.
 */
const StanceBadge = ({ color = 'slate', children, className = '' }: StanceBadgeProps) => {
  const colorClass = colorStyles[color] || colorStyles.slate

  return (
    <div className={`media-badge ${colorClass} ${className}`}>
      {children}
    </div>
  )
}

export default StanceBadge
