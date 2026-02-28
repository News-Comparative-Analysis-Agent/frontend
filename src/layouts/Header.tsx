import { useNavigate } from 'react-router-dom'
import { useUserStore } from '../stores/useUserStore'

interface HeaderProps {
  variant?: 'primary' | 'white'
  activeStep?: 1 | 2 | 3 | 4
}

const Header = ({ variant = 'primary', activeStep }: HeaderProps) => {
  const navigate = useNavigate()
  const { user } = useUserStore()

  const isWhite = variant === 'white'

  const steps = [
    { id: 1, label: '주제 선택', path: '/' },
    { id: 2, label: '심층 분석', path: '/analysis' },
    { id: 3, label: '초안 작성', path: '/drafting' },
    { id: 4, label: '최종 검토', path: '/final-review' },
  ]

  return (
    <header className={`h-16 flex items-center justify-between border-b ${isWhite ? 'border-slate-100 bg-white' : 'border-white/10 bg-primary'} px-4 md:px-8 py-4 shrink-0 sticky top-0 z-[100] relative overflow-hidden`}>
      <div onClick={() => navigate('/')} className="flex items-center gap-3 w-1/4 cursor-pointer">
        <div className={`size-8 md:size-9 ${isWhite ? 'bg-primary/10 text-primary' : 'bg-white text-primary'} flex items-center justify-center rounded-xl shadow-sm`}>
          <span className="material-symbols-outlined text-xl md:text-2xl font-bold">center_focus_strong</span>
        </div>
        <div>
          <h1 className={`${isWhite ? 'text-slate-900' : 'text-white'} text-base md:text-lg font-bold leading-tight tracking-tight`}>foc-us</h1>
        </div>
      </div>

      <nav className="hidden lg:flex flex-1 justify-center items-center">
        {activeStep && (
          <div className="relative flex items-center gap-6 xl:gap-12">
            <div className={`absolute h-0.5 ${isWhite ? 'bg-slate-100' : 'bg-white/20'} top-1/2 left-0 right-0 -z-10`}></div>
            {steps.map((step) => (
              <div 
                key={step.id} 
                className="flex items-center gap-2 bg-white px-3 z-10 cursor-pointer" 
                onClick={() => navigate(step.path)}
              >
                <span className={`flex items-center justify-center size-7 rounded-full text-xs font-bold transition-all ${
                  activeStep === step.id 
                    ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                    : 'bg-slate-100 text-slate-400'
                }`}>
                  {step.id}
                </span>
                <span className={`text-sm transition-all ${
                  activeStep === step.id 
                    ? 'font-bold text-primary' 
                    : 'font-medium text-slate-400'
                }`}>
                  {step.label}
                </span>
              </div>
            ))}
          </div>
        )}
      </nav>

      <div className="flex items-center justify-end gap-3 md:gap-6 w-1/4">
        {activeStep === 3 && (
          <button className="flex items-center gap-2 px-2 md:px-3 py-1.5 bg-orange-50 text-primary border border-orange-200 rounded-lg hover:bg-orange-100 transition-all duration-200 active:scale-95 group">
            <span className="material-symbols-outlined text-[18px] group-hover:rotate-180 transition-transform duration-500">refresh</span>
            <span className="text-[10px] md:text-xs font-bold whitespace-nowrap">초안 다시 생성</span>
          </button>
        )}

        <div 
          className="flex items-center gap-2 md:gap-3 cursor-pointer group"
          onClick={() => navigate('/login')}
        >
          <div className="text-right hidden sm:block">
            <p className={`text-[11px] md:text-xs font-bold ${isWhite ? 'text-slate-700' : 'text-white'} group-hover:text-primary transition-colors`}>{user?.name}</p>
            <p className={`text-[9px] md:text-[10px] ${isWhite ? 'text-slate-400' : 'text-white/60'} font-medium`}>{user?.role}</p>
          </div>
          <div className={`size-8 md:size-9 rounded-full ${isWhite ? 'bg-slate-100 border-slate-200' : 'bg-white/20 border-white/10'} overflow-hidden group-hover:border-primary transition-all shadow-sm`}>
            {user?.avatar ? (
              <img alt="Profile" className="w-full h-full object-cover" src={user.avatar} />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary">
                <span className="material-symbols-outlined">person</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
