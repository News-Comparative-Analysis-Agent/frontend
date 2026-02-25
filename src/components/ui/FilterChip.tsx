interface FilterChipProps {
  label: string;
  checked: boolean;
  onChange: () => void;
  showIcon?: boolean;
}

const FilterChip = ({ label, checked, onChange, showIcon = true }: FilterChipProps) => {
  return (
    <label className="cursor-pointer select-none shrink-0">
      <input 
        type="checkbox" 
        className="filter-checkbox peer hidden" 
        checked={checked} 
        onChange={onChange}
      />
      <div className="relative flex items-center justify-center px-5 py-2.5 rounded-full border border-slate-200 bg-white text-slate-400 text-[12px] font-bold transition-all hover:border-slate-300 peer-checked:bg-primary/5 peer-checked:border-primary peer-checked:text-primary">
        {showIcon && (
          <span className="material-symbols-outlined absolute left-2 text-[16px] leading-none opacity-0 scale-50 peer-checked:opacity-100 peer-checked:scale-100 transition-all">
            check_circle
          </span>
        )}
        <span className={showIcon ? "pl-1" : ""}>{label}</span>
      </div>
    </label>
  )
}

export default FilterChip;
