import { ReactNode } from 'react'

interface ProfileInfoFieldProps {
  label: string
  value?: string | null
  colSpan?: 1 | 2
  children?: ReactNode
}

/**
 * 프로필 정보의 라벨-값 쌍을 표시하는 재사용 가능한 컴포넌트입니다.
 * children이 제공되면 value 대신 children을 렌더링합니다.
 */
const ProfileInfoField = ({ label, value, colSpan = 1, children }: ProfileInfoFieldProps) => {
  return (
    <div className={`space-y-1.5 ${colSpan === 2 ? 'col-span-2' : ''}`}>
      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">{label}</label>
      {children ?? <p className="text-lg font-bold text-slate-800">{value ?? '-'}</p>}
    </div>
  )
}

export default ProfileInfoField
