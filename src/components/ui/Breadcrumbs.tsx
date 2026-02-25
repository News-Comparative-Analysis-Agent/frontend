import { useNavigate } from 'react-router-dom'

interface BreadcrumbItem {
  label: string;
  path?: string;
  isLast?: boolean;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

const Breadcrumbs = ({ items }: BreadcrumbsProps) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white border-b border-slate-50 px-4 md:px-8 py-3 shrink-0">
      <div className="flex items-center gap-2 text-[12px] font-medium text-slate-400">
        <span className="material-symbols-outlined text-[16px] cursor-pointer hover:text-primary transition-colors" onClick={() => navigate('/')}>home</span>
        {items.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px]">chevron_right</span>
            {item.path && !item.isLast ? (
              <span 
                className="cursor-pointer hover:text-primary transition-colors" 
                onClick={() => navigate(item.path!)}
              >
                {item.label}
              </span>
            ) : (
              <span className={item.isLast ? "text-slate-800 font-bold" : ""}>{item.label}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default Breadcrumbs;
