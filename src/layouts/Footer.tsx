import { useNavigate } from 'react-router-dom'

const Footer = () => {
  const navigate = useNavigate()

  return (
    <footer className="py-12 border-t border-slate-100 px-16 text-[11px] text-slate-500 bg-white mt-12 animate-fade-in">
      <div className="max-w-[1100px] mx-auto flex flex-col items-center">
        <div className="flex items-center gap-2 grayscale-0 opacity-100 hover:text-primary transition-all cursor-pointer" onClick={() => navigate('/')}>
          <span className="font-bold tracking-[0.2em] uppercase text-[12px]">FOC-US</span>
        </div>
      </div>
    </footer>
  )
}

export default Footer
