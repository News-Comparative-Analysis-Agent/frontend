import { useNavigate } from 'react-router-dom'

const Footer = () => {
  const navigate = useNavigate()

  return (
    <footer className="py-16 border-t border-slate-200/60 px-16 text-[11px] text-slate-500 bg-slate-100/50 animate-fade-in">
      <div className="max-w-[1100px] mx-auto flex flex-col items-center">
        <div className="flex items-center gap-2 hover:text-slate-800 transition-all cursor-pointer" onClick={() => navigate('/')}>
          <span className="font-bold tracking-[0.2em] uppercase text-[14px] text-slate-400">FOCUS</span>
        </div>
      </div>
    </footer>
  )
}

export default Footer
