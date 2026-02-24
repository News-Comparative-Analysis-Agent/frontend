import { useNavigate } from 'react-router-dom'

const Footer = () => {
  const navigate = useNavigate()

  return (
    <footer className="py-12 border-t border-slate-100 px-16 text-[11px] text-slate-400 bg-white mt-12">
      <div className="max-w-[1100px] mx-auto flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 grayscale opacity-50 cursor-pointer" onClick={() => navigate('/')}>
            <span className="material-symbols-outlined text-sm font-bold">hub</span>
            <span className="font-bold">인사이트 허브</span>
          </div>
          <p className="font-bold">© 2024 Insight Hub Engine. All Rights Reserved.</p>
        </div>
        <div className="flex items-center gap-6 uppercase font-bold tracking-tight">
          <a className="hover:text-primary transition-colors" href="#">서비스 약관</a>
          <a className="hover:text-primary transition-colors" href="#">개인정보 처리방침</a>
          <a className="hover:text-primary transition-colors" href="#">API 가이드</a>
        </div>
      </div>
    </footer>
  )
}

export default Footer
