import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost' | 'icon'
  size?: 'sm' | 'md' | 'lg' | 'icon'
  children?: React.ReactNode
  icon?: React.ReactNode
  className?: string
}

/**
 * 프로젝트 전반에서 사용되는 공통 버튼 컴포넌트입니다.
 * 기존의 프리미엄 디자인 스타일을 그대로 유지합니다.
 */
const Button = ({ 
  variant = 'primary', 
  size = 'md', 
  children, 
  icon, 
  className = '', 
  ...props 
}: ButtonProps) => {
  
  // 기본 스타일
  const baseStyles = 'inline-flex items-center justify-center font-bold transition-all active:scale-95 shrink-0 disabled:opacity-50 disabled:pointer-events-none'
  
  // 변체별 스타일 (기존 디자인 추출)
  const variants = {
    primary: 'bg-primary text-white hover:bg-primary-dark shadow-lg shadow-primary/20',
    outline: 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-primary hover:border-primary/30 shadow-sm',
    ghost: 'text-slate-400 hover:text-slate-600 hover:bg-slate-100',
    icon: 'bg-primary text-white hover:bg-primary-dark shadow-lg'
  }
  
  // 사이즈별 스타일
  const sizes = {
    sm: 'px-4 py-1.5 rounded-lg text-[12px]',
    md: 'px-6 py-2.5 rounded-xl text-sm',
    lg: 'px-8 py-3 rounded-xl text-base',
    icon: 'size-11 rounded-xl'
  }

  const combinedClassName = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`

  return (
    <button className={combinedClassName} {...props}>
      {icon && <span className={`material-symbols-outlined ${children ? 'mr-2' : ''} text-[20px]`}>{icon}</span>}
      {children}
    </button>
  )
}

export default Button
