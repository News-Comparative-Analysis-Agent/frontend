import React from 'react'
import { useUserStore } from '../../stores/useUserStore'

interface LoginModalProps {
  isOpen: boolean
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen }) => {
  const login = useUserStore((state) => state.login)

  // 배경 스크롤 차단 로직 추가
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null

  const handleSocialLogin = (provider: 'google' | 'kakao') => {
    console.log(`${provider} 로그인 시도...`);
    
    if (provider === 'kakao') {
      window.location.href = 'https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=fb2adf71ebb777c796fe87585202484a&redirect_uri=https://209.38.76.211.nip.io/user/login/kakao';
    } else {
      window.location.href = 'https://accounts.google.com/o/oauth2/v2/auth?client_id=368165235592-uldsap02g23hvi3u313drn1ehrfeblso.apps.googleusercontent.com&redirect_uri=https://209.38.76.211.nip.io/user/login/google&response_type=id_token&scope=openid%20email%20profile&nonce=anything_random_string';
    }
  };

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-6 animate-in fade-in duration-500">
      {/* 화이트 블러 백드롭 (사용자 요청에 따라 강도 강화) */}
      <div className="absolute inset-0 bg-white/40 backdrop-blur-md transition-all duration-700" />
      
      {/* 모달 컨텐츠 */}
      <div className="relative w-full max-w-[400px] bg-white rounded-[40px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] border border-slate-100 p-10 md:p-12 animate-in zoom-in-95 slide-in-from-bottom-10 duration-500">
        <div className="flex flex-col items-center mb-12 text-center">
          <div className="size-16 bg-primary/10 text-primary flex items-center justify-center mb-5 rounded-2xl shadow-sm rotate-3">
            <span className="material-symbols-outlined text-[42px] font-bold">hub</span>
          </div>
          <h1 className="text-slate-900 text-3xl font-bold tracking-tight mb-2">FOC-US</h1>
          <p className="text-slate-500 text-[15px] font-medium leading-relaxed">
            뉴스 분석의 새로운 기준<br/>
            지금 바로 시작해 보세요.
          </p>
        </div>

        <div className="space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-slate-800 text-lg font-bold">간편 로그인으로 시작하기</h2>
            <p className="text-slate-400 text-sm font-medium">별도의 가입 없이 3초 만에 시작하세요</p>
          </div>

          <div className="flex justify-center items-center gap-10">
            {/* 구글 로그인 */}
            <button
              aria-label="구글 로그인"
              className="group flex flex-col items-center gap-3 outline-none"
              onClick={() => handleSocialLogin('google')}
            >
              <div className="flex items-center justify-center size-20 bg-white border border-slate-200 rounded-[28px] hover:bg-slate-50 hover:border-slate-300 hover:shadow-xl transition-all active:scale-95">
                <svg className="w-10 h-10" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  ></path>
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  ></path>
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                    fill="#FBBC05"
                  ></path>
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.47 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z"
                    fill="#EA4335"
                  ></path>
                </svg>
              </div>
              <span className="text-xs font-bold text-slate-400 group-hover:text-slate-600 transition-colors uppercase tracking-widest">Google</span>
            </button>

            {/* 카카오 로그인 */}
            <button
              aria-label="카카오 로그인"
              className="group flex flex-col items-center gap-3 outline-none"
              onClick={() => handleSocialLogin('kakao')}
            >
              <div className="flex items-center justify-center size-20 bg-[#FEE500] rounded-[28px] hover:brightness-95 hover:shadow-xl transition-all active:scale-95">
                <svg className="w-10 h-10 text-[#191919]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 3c-4.97 0-9 3.185-9 7.115 0 2.558 1.707 4.8 4.315 6.091l-1.098 4.047c-.053.195.059.398.248.455.062.019.127.022.191.009.053-.01.1-.035.138-.073l4.787-3.172c.46.04.928.06 1.419.06 4.97 0 9-3.185 9-7.115S16.97 3 12 3z"></path>
                </svg>
              </div>
              <span className="text-xs font-bold text-slate-400 group-hover:text-slate-600 transition-colors uppercase tracking-widest">Kakao</span>
            </button>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-slate-50">
          <div className="flex items-center justify-center gap-2 opacity-30">
            <span className="size-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-none">
              System Secure Connection
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginModal
