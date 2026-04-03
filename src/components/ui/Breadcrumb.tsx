import { useNavigate } from 'react-router-dom'

interface BreadcrumbProps {
  items: string[]
}

const Breadcrumb = ({ items }: BreadcrumbProps) => {
  const navigate = useNavigate()

  return (
    <div className="bg-white border-b border-slate-50 px-4 md:px-8 py-3 shrink-0">
      <div className="flex items-center gap-2 text-[12px] font-medium text-slate-400">
        <span
          className="material-symbols-outlined icon-sm cursor-pointer hover:text-primary transition-colors"
          onClick={() => navigate('/')}
        >
          home
        </span>
        {items.map((item, idx) => (
          <span key={idx} className="flex items-center gap-2">
            <span className="material-symbols-outlined icon-sm">chevron_right</span>
            <span className={idx === items.length - 1 ? 'text-slate-800 font-bold' : ''}>
              {item}
            </span>
          </span>
        ))}
      </div>
    </div>
  )
}

export default Breadcrumb
