import React from 'react'
import { useNavigate } from 'react-router-dom'

const SignupPage: React.FC = () => {
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
            <h1 className="text-slate-900 text-xl font-bold tracking-tight">회원가입</h1>
            <p className="text-slate-400 text-xs font-medium">Join Insight Hub</p>
          </div>

          <form action="#" className="space-y-4" onSubmit={(e) => { e.preventDefault(); navigate('/'); }}>
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-500 ml-1 uppercase tracking-wider" htmlFor="name">
                이름
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                  <span className="material-symbols-outlined text-lg">person</span>
                </div>
                <input
                  className="block w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-slate-400"
                  id="name"
                  name="name"
                  placeholder="홍길동"
                  type="text"
                />
              </div>
            </div>

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

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-500 ml-1 uppercase tracking-wider" htmlFor="confirm-password">
                비밀번호 확인
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                  <span className="material-symbols-outlined text-lg">check_circle</span>
                </div>
                <input
                  className="block w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-slate-400"
                  id="confirm-password"
                  name="confirm-password"
                  placeholder="••••••••"
                  type="password"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3.5 rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                type="button"
                onClick={() => navigate('/')}
              >
                가입하기
                <span className="material-symbols-outlined text-lg">person_add</span>
              </button>
            </div>
          </form>

          <div className="mt-8 flex flex-col items-center gap-3">
            <div className="w-full h-px bg-slate-50"></div>
            <div className="text-slate-400 text-xs">
              이미 계정이 있으신가요?
              <button
                className="text-primary font-bold ml-1 hover:underline underline-offset-4"
                onClick={() => navigate('/login')}
              >
                로그인
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

export default SignupPage
