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
    <div className="relative flex items-center gap-6 xl:gap-12">
      <div className="absolute h-0.5 bg-slate-100 top-1/2 left-0 right-0 -z-10"></div>
      {steps.map((step) => (
        <div
          key={step.id}
          className={`flex items-center gap-2 bg-white px-3 z-10 transition-all ${
            activeStep === step.id ? 'opacity-100' : 'opacity-60'
          }`}
        >
          <span className={`flex items-center justify-center size-7 rounded-full text-xs font-bold transition-all ${
            activeStep === step.id
              ? 'bg-primary text-white shadow-lg shadow-primary/20'
              : 'bg-slate-100 text-slate-400'
          }`}>
            {step.id}
          </span>
          <span className={`text-sm transition-all ${
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
