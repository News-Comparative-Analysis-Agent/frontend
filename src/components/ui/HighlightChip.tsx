import React from 'react'

interface HighlightChipProps {
  label: string
  value: string
  className?: string
}

/**
 * 텍스트와 값을 조합하여 중요한 정보를 강조하는 칩 컴포넌트입니다.
 * 디자인 가이드의 .highlight-chip 스타일을 적용합니다.
 */
const HighlightChip = ({ label, value, className = '' }: HighlightChipProps) => {
  return (
    <div className={`highlight-chip ${className}`}>
      <span className="text-slate-400 font-medium mr-1.5">{label}</span>
      {value}
    </div>
  )
}

export default HighlightChip
