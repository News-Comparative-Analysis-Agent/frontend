import React from 'react'
import { useNavigate } from 'react-router-dom'

const LoginPage: React.FC = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden py-8 bg-background font-sans">
      <div className="absolute inset-0 digital-grid opacity-50 pointer-events-none"></div>
      
      <main className="relative z-10 w-full max-w-[420px] px-6">
        <div className="bg-white rounded-3xl shadow-2xl shadow-slate-200/60 border border-slate-100 p-8 md:p-10">
          <div className="flex flex-col items-center mb-7">
            <div className="size-12 text-primary flex items-center justify-center mb-2">
              <span className="material-symbols-outlined text-4xl font-bold">hub</span>
            </div>
            <h1 className="text-slate-900 text-xl font-bold tracking-tight">인사이트 허브</h1>
            <p className="text-slate-400 text-xs font-medium">Insight Hub</p>
          </div>

          <form action="#" className="space-y-4" onSubmit={(e) => { e.preventDefault(); navigate('/'); }}>
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-500 ml-1 uppercase tracking-wider" htmlFor="email">
                이메일 주소
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                  <span className="material-symbols-outlined text-lg">mail</span>
                </div>
                <input
                  className="block w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-slate-400"
                  id="email"
                  name="email"
                  placeholder="example@company.com"
                  type="email"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-500 ml-1 uppercase tracking-wider" htmlFor="password">
                비밀번호
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                  <span className="material-symbols-outlined text-lg">lock</span>
                </div>
                <input
                  className="block w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-slate-400"
                  id="password"
                  name="password"
                  placeholder="••••••••"
                  type="password"
                />
              </div>
            </div>

            <div className="pt-1">
              <button
                className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3.5 rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                type="button"
                onClick={() => navigate('/')}
              >
                로그인
                <span className="material-symbols-outlined text-lg">login</span>
              </button>
            </div>
          </form>

          <div className="mt-8">
            <div className="relative flex items-center mb-6">
              <div className="flex-grow border-t border-slate-100"></div>
              <span className="flex-shrink mx-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                간편 로그인
              </span>
              <div className="flex-grow border-t border-slate-100"></div>
            </div>

            <div className="flex justify-center items-center gap-4">
              <button
                aria-label="구글 로그인"
                className="flex items-center justify-center size-11 bg-white border border-slate-200 rounded-full hover:bg-slate-50 transition-all shadow-sm active:scale-95"
                onClick={() => navigate('/')}
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
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
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z"
                    fill="#EA4335"
                  ></path>
                </svg>
              </button>
              <button
                aria-label="카카오 로그인"
                className="flex items-center justify-center size-11 bg-[#FEE500] rounded-full hover:brightness-95 transition-all shadow-sm active:scale-95"
                onClick={() => navigate('/')}
              >
                <svg className="w-5 h-5 text-[#191919]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 3c-4.97 0-9 3.185-9 7.115 0 2.558 1.707 4.8 4.315 6.091l-1.098 4.047c-.053.195.059.398.248.455.062.019.127.022.191.009.053-.01.1-.035.138-.073l4.787-3.172c.46.04.928.06 1.419.06 4.97 0 9-3.185 9-7.115S16.97 3 12 3z"></path>
                </svg>
              </button>
            </div>
          </div>

          <div className="mt-8 flex flex-col items-center gap-3">
            <button className="text-slate-400 text-xs hover:text-primary transition-colors font-medium">
              비밀번호를 잊으셨나요?
            </button>
            <div className="w-full h-px bg-slate-50"></div>
            <div className="text-slate-400 text-xs">
              계정이 없으신가요?
              <button
                className="text-primary font-bold ml-1 hover:underline underline-offset-4"
                onClick={() => navigate('/signup')}
              >
                회원가입
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-slate-400 text-[11px] font-medium tracking-tight">
            AI 기반 다각도 뉴스 분석 및 기자용 초안 작성 시스템
          </p>
          <div className="flex items-center justify-center gap-2 mt-3 opacity-30">
            <span className="size-1 bg-emerald-500 rounded-full"></span>
            <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">
              System Secure
            </span>
          </div>
        </div>
      </main>
    </div>
  )
}

export default LoginPage
