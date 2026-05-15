import { useNavigate, useSearchParams, useLocation } from 'react-router-dom'
import { useUserStore } from '../stores/useUserStore'
import StepNavigation from '../components/ui/StepNavigation'
import UserAvatar from '../components/ui/UserAvatar'
import { useIssueStore } from '../stores/useIssueStore'

interface HeaderProps {
  variant?: 'primary' | 'white'
  activeStep?: 1 | 2 | 3 | 4
  headerExtra?: React.ReactNode
}

const STEPS = [
  { id: 1, label: '주제 선택', path: '/' },
  { id: 2, label: '심층 분석', path: '/analysis' },
  { id: 3, label: '초안 작성', path: '/drafting' },
  { id: 4, label: '최종 검토', path: '/final-review' },
] as const

const Header = ({ variant = 'primary', activeStep, headerExtra }: HeaderProps) => {
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const { user, isLoggedIn, logout, setLoginModalOpen } = useUserStore()
  const { activeIssueType, setActiveIssueType } = useIssueStore()

  const issueId = searchParams.get('id') || '1'
  const isWhite = variant === 'white'
  const isMyPage = location.pathname.startsWith('/mypage')

  const handleLogout = () => {
    logout();
    navigate('/');
  }

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
    <header className={`h-14 xl:h-16 flex items-center justify-between ${isWhite ? 'border-b border-slate-100 bg-white' : 'bg-primary'} px-4 xl:px-8 py-3 xl:py-4 shrink-0 sticky top-0 z-[100] relative overflow-hidden`}>
      <div className="flex items-center gap-4 shrink-0">
        <div onClick={() => navigate('/')} className="flex items-center gap-3 cursor-pointer group">
          <div className={`size-8 md:size-9 ${isWhite ? 'bg-primary/10 text-primary' : 'bg-white text-primary'} flex items-center justify-center rounded-xl shadow-sm group-hover:scale-110 transition-transform shrink-0`}>
            <span className="material-symbols-outlined text-xl md:text-2xl font-bold">center_focus_strong</span>
          </div>
          <div className="hidden sm:block">
            <h1 className={`${isWhite ? 'text-slate-900' : 'text-white'} text-base md:text-lg font-bold leading-tight tracking-tight whitespace-nowrap`}>FOCUS</h1>
          </div>
        </div>
        
        {activeStep && activeStep > 1 && (
          <button 
            onClick={handleBack}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg border transition-all whitespace-nowrap shrink-0 ${
              isWhite 
                ? 'border-slate-200 text-slate-600 hover:bg-slate-50' 
                : 'border-white/20 text-white/90 hover:bg-white/10'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            <span className="text-xs font-semibold">뒤로</span>
          </button>
        )}
      </div>

      <nav className="hidden md:flex flex-1 items-center justify-center min-w-0 px-2">
        {activeStep ? (
          // activeStep이 있는 페이지에서는 사설/컬럼 모드일 때만 StepNavigation 표시
          activeIssueType !== 'politics' && (
            <StepNavigation steps={[...STEPS]} activeStep={activeStep} />
          )
        ) : (
          !isMyPage && (
            <div className="flex items-center justify-center w-full">
              {/* 메인 페이지 전용 전역 탭 - 달력과 동일한 260px 고정 너비 적용 */}
              <div className={`absolute left-1/2 -translate-x-1/2 flex items-center gap-0.5 p-1 rounded-xl border transition-all w-[260px] ${
                isWhite ? 'bg-slate-100/50 border-slate-200 shadow-inner' : 'bg-white/10 border-white/10'
              }`}>
                <button
                  onClick={() => setActiveIssueType('politics')}
                  className={`flex-1 py-1.5 rounded-lg text-[12px] lg:text-[13px] font-semibold transition-all flex items-center justify-center gap-1.5 lg:gap-2 ${
                    activeIssueType === 'politics' 
                      ? (isWhite ? 'bg-white text-primary shadow-md' : 'bg-white text-slate-900 shadow-lg scale-105')
                      : (isWhite ? 'text-slate-500 hover:text-slate-700' : 'text-white/60 hover:text-white hover:bg-white/5')
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px] lg:text-[18px]" style={{ fontVariationSettings: "'wght' 300" }}>whatshot</span>
                  최신 이슈
                </button>
                <button
                  onClick={() => setActiveIssueType('editorial')}
                  className={`flex-1 py-1.5 rounded-lg text-[12px] lg:text-[13px] font-semibold transition-all flex items-center justify-center gap-1.5 lg:gap-2 ${
                    activeIssueType === 'editorial' 
                      ? (isWhite ? 'bg-white text-primary shadow-md' : 'bg-white text-slate-900 shadow-lg scale-105')
                      : (isWhite ? 'text-slate-500 hover:text-slate-700' : 'text-white/60 hover:text-white hover:bg-white/5')
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px] lg:text-[18px]" style={{ fontVariationSettings: "'wght' 300" }}>auto_stories</span>
                  사설/컬럼
                </button>
              </div>

              {/* 캘린더 등 추가 헤더 요소 영역 */}
              {headerExtra && (
                <div className="hidden lg:flex items-center">
                  {headerExtra}
                </div>
              )}
            </div>
          )
        )}
      </nav>

      <div className="flex items-center gap-2 md:gap-4 shrink-0 justify-end">
        {isLoggedIn ? (
          <div className="flex items-center gap-2 sm:gap-4">
            <button 
              onClick={handleLogout}
              className={`text-[10px] md:text-[11px] font-semibold px-3 py-1.5 rounded-lg border transition-all ${
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
              onClick={() => setLoginModalOpen(true)}
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
