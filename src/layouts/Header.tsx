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
      <div className="flex items-center gap-4 w-1/4">
        <div onClick={() => navigate('/')} className="flex items-center gap-3 cursor-pointer group">
          <div className={`size-8 md:size-9 ${isWhite ? 'bg-primary/10 text-primary' : 'bg-white text-primary'} flex items-center justify-center rounded-xl shadow-sm group-hover:scale-110 transition-transform`}>
            <span className="material-symbols-outlined text-xl md:text-2xl font-bold">center_focus_strong</span>
          </div>
          <div>
            <h1 className={`${isWhite ? 'text-slate-900' : 'text-white'} text-base md:text-lg font-bold leading-tight tracking-tight`}>FOC-US</h1>
          </div>
        </div>
        
        {activeStep && activeStep > 1 && (
          <button 
            onClick={() => navigate(-1)}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg border transition-all ${
              isWhite 
                ? 'border-slate-200 text-slate-600 hover:bg-slate-50' 
                : 'border-white/20 text-white/90 hover:bg-white/10'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            <span className="text-xs font-bold">뒤로</span>
          </button>
        )}
      </div>

      <nav className="hidden lg:flex flex-1 justify-center items-center">
        {activeStep && (
          <div className="relative flex items-center gap-6 xl:gap-12">
            <div className={`absolute h-0.5 ${isWhite ? 'bg-slate-100' : 'bg-white/20'} top-1/2 left-0 right-0 -z-10`}></div>
            {steps.map((step) => (
              <div 
                key={step.id} 
                className={`flex items-center gap-2 bg-white px-3 z-10 transition-all ${
                  activeStep === step.id ? 'opacity-100' : 'opacity-60'
                }`}
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

      <div className="flex items-center gap-2 md:gap-4 w-1/4 justify-end">

        <div 
          className="flex items-center gap-2 md:gap-3 cursor-pointer group"
          onClick={() => navigate('/mypage')}
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
