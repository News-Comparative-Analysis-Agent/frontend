import { useNavigate, useSearchParams } from 'react-router-dom'
import { useUserStore } from '../stores/useUserStore'
import StepNavigation from '../components/ui/StepNavigation'
import UserAvatar from '../components/ui/UserAvatar'

interface HeaderProps {
  variant?: 'primary' | 'white'
  activeStep?: 1 | 2 | 3 | 4
}

const STEPS = [
  { id: 1, label: '주제 선택', path: '/' },
  { id: 2, label: '심층 분석', path: '/analysis' },
  { id: 3, label: '초안 작성', path: '/drafting' },
  { id: 4, label: '최종 검토', path: '/final-review' },
] as const

const Header = ({ variant = 'primary', activeStep }: HeaderProps) => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { user, isLoggedIn, logout } = useUserStore()

  const issueId = searchParams.get('id') || '1'
  const isWhite = variant === 'white'

  const handleBack = () => {
    if (!activeStep || activeStep === 1) {
      navigate('/')
      return
    }
    
    const prevStep = STEPS.find(s => s.id === activeStep - 1)
    if (prevStep) {
      const targetPath = prevStep.id === 1 ? '/' : `${prevStep.path}?id=${issueId}`
      navigate(targetPath)
    } else {
      navigate(-1)
    }
  }

  return (
    <header className={`h-16 flex items-center justify-between ${isWhite ? 'border-b border-slate-100 bg-white' : 'bg-primary'} px-4 md:px-8 py-4 shrink-0 sticky top-0 z-[100] relative overflow-hidden`}>
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
            onClick={handleBack}
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
          <StepNavigation steps={[...STEPS]} activeStep={activeStep} />
        )}
      </nav>

      <div className="flex items-center gap-2 md:gap-4 w-1/4 justify-end">
        {isLoggedIn ? (
          <div className="flex items-center gap-2 sm:gap-4">
            <button 
              onClick={() => {
                logout();
                navigate('/login');
              }}
              className={`text-[10px] md:text-[11px] font-bold px-3 py-1.5 rounded-lg border transition-all ${
                isWhite 
                  ? 'border-slate-200 text-slate-500 hover:bg-slate-50' 
                  : 'border-white/20 text-white/90 hover:bg-white/10'
              }`}
            >
              로그아웃
            </button>
            <div 
              className="flex items-center gap-2 md:gap-3 cursor-pointer group"
              onClick={() => navigate('/mypage')}
            >
              <div className="text-right hidden sm:block">
                <p className={`text-[11px] md:text-xs font-bold ${isWhite ? 'text-slate-700' : 'text-white'} group-hover:text-primary transition-colors`}>MY</p>
              </div>
              <UserAvatar
                avatar={user?.avatar}
                size="sm"
                className={`${isWhite ? 'bg-slate-100 border-slate-200' : 'bg-white/20 border-white/10'} group-hover:border-primary transition-all shadow-sm border`}
              />
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2 md:gap-3">
            <button 
              onClick={() => navigate('/login')}
              className={`text-xs md:text-sm font-bold px-5 py-2.5 rounded-xl transition-all ${
                isWhite 
                  ? 'text-white bg-slate-900 hover:bg-slate-800 shadow-md shadow-slate-900/10' 
                  : 'text-primary bg-white hover:bg-white/90 shadow-md shadow-white/10'
              }`}
            >
              로그인
            </button>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header
