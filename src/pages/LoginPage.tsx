import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { API_BASE_URL } from '../api/config'
import { useUserStore } from '../stores/useUserStore'

const LoginPage: React.FC = () => {
  const navigate = useNavigate()
  const { isLoggedIn, login } = useUserStore()

  // 이미 로그인된 상태라면 메인 페이지로 자동 이동
  useEffect(() => {
    if (isLoggedIn) {
      navigate('/')
    }
  }, [isLoggedIn, navigate])

  const handleSocialLogin = (provider: 'google' | 'kakao') => {
    // 1. 현재 브라우저의 주소(localhost 또는 배포주소)를 가져와 리다이렉트 주소 생성
    const redirectUri = `${window.location.origin}/auth/callback`;
    
    // 2. 서버의 인증 엔드포인트로 이동 (redirect_uri 파라미터를 포함하여 서버가 다시 보내줄 위치를 알림)
    // 서버 엔드포인트는 일반적인 관례에 따라 /api/auth/{provider}로 가정합니다.
    const loginUrl = `${API_BASE_URL}/api/auth/${provider}?redirect_uri=${encodeURIComponent(redirectUri)}`;
    
    console.log(`${provider} 로그인 시도... -> ${loginUrl}`);
    
    // 실제 서버 주소로 이동 (OAuth 댄스 시작)
    window.location.href = loginUrl;
  };

  const handleDevLogin = () => {
    // 가짜 유저 정보와 토큰으로 즉시 로그인 처리
    const dummyUser = {
      nickname: 'Guest 개발자',
      email: 'dev@test.com',
      id: 0,
      avatar: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png'
    };
    const dummyToken = 'dev_mock_token_12345';
    
    // 스토어의 login 함수를 호출하여 상태 변경 (useEffect가 감지하여 리다이렉트함)
    login(dummyUser, dummyToken);
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden py-8 bg-background font-sans text-left">
      <div className="absolute inset-0 digital-grid opacity-50 pointer-events-none"></div>
      
      <main className="relative z-10 w-full max-w-[400px] px-6">
        <div className="bg-white rounded-3xl shadow-2xl shadow-slate-200/60 border border-slate-100 p-8 md:p-10">
          <div className="flex flex-col items-center mb-10 text-center">
            <div className="size-14 bg-primary/10 text-primary flex items-center justify-center mb-4 rounded-2xl shadow-sm rotate-3">
              <span className="material-symbols-outlined text-4xl font-bold">hub</span>
            </div>
            <h1 className="text-slate-900 text-2xl font-bold tracking-tight">FOC-US</h1>
            <p className="text-slate-500 text-sm font-medium mt-1">뉴스 분석의 새로운 기준</p>
          </div>

          <div className="space-y-10">
            <div className="text-center space-y-2">
              <h2 className="text-slate-800 text-base font-bold">간편 로그인으로 시작하기</h2>
              <p className="text-slate-400 text-[13px]">별도의 가입 없이 3초 만에 시작하세요</p>
            </div>

            <div className="flex justify-center items-center gap-10">
              <button
                aria-label="구글 로그인"
                className="group flex flex-col items-center gap-2 outline-none"
                onClick={() => handleSocialLogin('google')}
              >
                <div className="flex items-center justify-center size-16 bg-white border border-slate-200 rounded-[22px] hover:bg-slate-50 hover:border-slate-300 hover:shadow-lg transition-all active:scale-95">
                  <svg className="w-8 h-8" viewBox="0 0 24 24">
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
                <span className="text-xs font-bold text-slate-400 group-hover:text-slate-600 transition-colors">Google</span>
              </button>

              <button
                aria-label="카카오 로그인"
                className="group flex flex-col items-center gap-2 outline-none"
                onClick={() => handleSocialLogin('kakao')}
              >
                <div className="flex items-center justify-center size-16 bg-[#FEE500] rounded-[22px] hover:brightness-95 hover:shadow-lg transition-all active:scale-95">
                  <svg className="w-8 h-8 text-[#191919]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 3c-4.97 0-9 3.185-9 7.115 0 2.558 1.707 4.8 4.315 6.091l-1.098 4.047c-.053.195.059.398.248.455.062.019.127.022.191.009.053-.01.1-.035.138-.073l4.787-3.172c.46.04.928.06 1.419.06 4.97 0 9-3.185 9-7.115S16.97 3 12 3z"></path>
                  </svg>
                </div>
                <span className="text-xs font-bold text-slate-400 group-hover:text-slate-600 transition-colors">Kakao</span>
              </button>
            </div>
          </div>

          <div className="mt-12 pt-6 border-t border-slate-50">
            <p className="text-slate-400 text-[11px] font-medium text-center leading-relaxed">
              FOC-US에 오신 것을 환영합니다.<br/>
              뉴스 분석의 새로운 경험을 시작해 보세요.
            </p>
          </div>
        </div>

        <div className="mt-8 text-center flex flex-col items-center gap-3">
          <div className="flex items-center justify-center gap-2 opacity-30">
            <span className="size-1 bg-emerald-500 rounded-full"></span>
            <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">
              System Secure
            </span>
          </div>
          
          <button 
            onClick={handleDevLogin}
            className="px-4 py-1.5 rounded-full border border-slate-200 text-slate-400 text-[10px] font-bold hover:bg-slate-50 hover:text-primary transition-all shadow-sm"
          >
            [개발자용] 로그인 건너뛰기
          </button>
        </div>
      </main>
    </div>
  )
}

export default LoginPage
