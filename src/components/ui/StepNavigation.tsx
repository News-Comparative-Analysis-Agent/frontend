interface Step {
  id: number
  label: string
  path: string
}

interface StepNavigationProps {
  steps: Step[]
  activeStep: number
}

/**
 * 헤더에 표시되는 단계별 진행 네비게이션 컴포넌트입니다.
 */
const StepNavigation = ({ steps, activeStep }: StepNavigationProps) => {
  return (
    <div className="relative flex items-center gap-4 xl:gap-8">
      <div className="absolute h-0.5 bg-slate-100 top-1/2 left-0 right-0 -z-10"></div>
      {steps.map((step) => (
        <div
          key={step.id}
          className={`flex items-center gap-1.5 bg-white px-2 z-10 transition-all ${
            activeStep === step.id ? 'opacity-100' : 'opacity-60'
          }`}
        >
          <span className={`flex items-center justify-center size-6 rounded-full text-[10px] font-bold transition-all ${
            activeStep === step.id
              ? 'bg-primary text-white shadow-lg shadow-primary/20'
              : 'bg-slate-100 text-slate-400'
          }`}>
            {step.id}
          </span>
          <span className={`text-xs transition-all whitespace-nowrap ${
            activeStep === step.id
              ? 'font-bold text-primary'
              : 'font-medium text-slate-400'
          }`}>
            {step.label}
          </span>
        </div>
      ))}
    </div>
  )
}

export default StepNavigation
