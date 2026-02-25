import { useNavigate } from 'react-router-dom';

interface Step {
  number: number;
  title: string;
  description: string;
  path: string;
  isActive?: boolean;
}

interface StepIndicatorProps {
  steps: Step[];
}

const StepIndicator = ({ steps }: StepIndicatorProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-row items-start gap-8 py-6 flex-[2]">
      {steps.map((step) => (
        <div 
          key={step.number}
          className={`flex flex-col items-start gap-2 flex-1 relative cursor-pointer transition-all duration-300 ${step.isActive ? '' : 'opacity-70 hover:opacity-100 mt-2'}`}
          onClick={() => navigate(step.path)}
        >
          <span className={`flex items-center justify-center rounded-full font-black shadow-glow shrink-0 transition-all ${step.isActive ? 'size-14 bg-white text-primary text-2xl ring-4 ring-white/30' : 'size-10 bg-white/20 text-white text-lg border border-white/30'}`}>
            {step.number}
          </span>
          <div className="text-left">
            <p className={`${step.isActive ? 'text-[18px] font-black' : 'text-[16px] font-bold'} text-white leading-none`}>
              {step.title}
            </p>
            <p className={`${step.isActive ? 'text-[13px] opacity-90' : 'text-[12px] opacity-80'} text-white mt-2 leading-snug font-medium`}>
              {step.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}

export default StepIndicator;
