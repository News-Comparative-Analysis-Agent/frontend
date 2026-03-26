import React from 'react'

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg'
  text?: string
  subText?: string
  className?: string
  fullScreen?: boolean
}

const Loader = ({ size = 'md', text, subText, className = '', fullScreen = false }: LoaderProps) => {
  const sizeClasses = {
    sm: 'size-8',
    md: 'size-12',
    lg: 'size-16'
  }

  const dotSizeClasses = {
    sm: 'size-1.5',
    md: 'size-2.5',
    lg: 'size-3.5'
  }

  const radiusValues = {
    sm: -12,
    md: -18,
    lg: -24
  }

  const loaderContent = (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className={`relative ${sizeClasses[size]}`}>
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute top-1/2 left-1/2"
            style={{
              transform: `translate(-50%, -50%) rotate(${i * 45}deg) translateY(${radiusValues[size]}px)`,
            }}
          >
            <div 
              className={`${dotSizeClasses[size]} rounded-full bg-primary shadow-[0_0_8px_rgba(255,165,0,0.2)] animate-loader-dot`}
              style={{
                animationDelay: `${i * 0.125}s`,
              }}
            />
          </div>
        ))}
      </div>
      {text && (
        <div className="mt-8 text-center px-4">
          <p className="text-lg md:text-xl font-semibold text-slate-500 tracking-tight leading-relaxed animate-pulse-slow">
            {text}
          </p>
          {subText && (
            <p className="mt-2 text-[13px] md:text-sm text-slate-400 font-medium tracking-tight animate-pulse-slow [animation-delay:0.5s]">
              {subText}
            </p>
          )}
        </div>
      )}

      <style>{`
        @keyframes loader-dot {
          0% {
            transform: scale(1.15);
            opacity: 1;
            background-color: var(--primary-color, #FFA500);
            box-shadow: 0 0 12px rgba(255, 165, 0, 0.6);
          }
          20%, 100% {
            transform: scale(1);
            opacity: 0.25;
            background-color: var(--primary-color, #FFA500); 
            box-shadow: none;
          }
        }
        .animate-loader-dot {
          animation: loader-dot 1s infinite linear;
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }
        .animate-pulse-slow {
          animation: pulse-slow 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  )

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-[10000] bg-white flex items-center justify-center overflow-hidden">
        {loaderContent}
      </div>
    )
  }

  return loaderContent
}

export default Loader
