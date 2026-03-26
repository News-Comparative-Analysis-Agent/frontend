import Button from './Button'

interface ConfirmModalProps {
  isOpen: boolean
  title: string
  description: string
  cancelLabel?: string
  confirmLabel?: string
  onCancel: () => void
  onConfirm: () => void
  variant?: 'danger' | 'primary'
}

const VARIANT_STYLES = {
  danger: { bg: 'bg-red-50 text-red-500', icon: 'warning' },
  primary: { bg: 'bg-orange-50 text-primary', icon: 'info' },
} as const

const ConfirmModal = ({
  isOpen,
  title,
  description,
  cancelLabel = '취소',
  confirmLabel = '확인',
  onCancel,
  onConfirm,
  variant = 'primary'
}: ConfirmModalProps) => {
  if (!isOpen) return null

  const { bg, icon } = VARIANT_STYLES[variant]

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 animate-in fade-in duration-200">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]" 
        onClick={onCancel}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-8">
          <div className="flex items-start gap-4 mb-6">
            <div className={`size-12 rounded-2xl flex items-center justify-center shrink-0 ${bg}`}>
              <span className="material-symbols-outlined text-[28px]">
                {icon}
              </span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-2 leading-tight">
                {title}
              </h3>
              <p className="text-[15px] text-slate-500 leading-relaxed break-keep">
                {description}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onCancel}
              className="flex-1 h-12 rounded-xl text-[15px] font-bold text-slate-500 hover:bg-slate-50 transition-colors"
            >
              {cancelLabel}
            </button>
            <Button
              className="flex-1 h-12 shadow-md"
              onClick={onConfirm}
            >
              {confirmLabel}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ConfirmModal
