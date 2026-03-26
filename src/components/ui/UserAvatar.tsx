interface UserAvatarProps {
  avatar?: string | null
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const SIZE_CLASSES = {
  sm: 'size-8 md:size-9',
  md: 'size-12',
  lg: 'size-28',
} as const

const ICON_SIZES = {
  sm: 'text-xl',
  md: 'text-3xl',
  lg: 'text-5xl',
} as const

/**
 * 사용자 아바타 공통 컴포넌트입니다.
 * 아바타 이미지가 있으면 이미지를, 없으면 기본 person 아이콘을 표시합니다.
 */
const UserAvatar = ({ avatar, size = 'md', className = '' }: UserAvatarProps) => {
  return (
    <div className={`${SIZE_CLASSES[size]} rounded-full overflow-hidden ${className}`}>
      {avatar ? (
        <img alt="Profile" className="w-full h-full object-cover" src={avatar} />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary">
          <span className={`material-symbols-outlined ${ICON_SIZES[size]}`}>person</span>
        </div>
      )}
    </div>
  )
}

export default UserAvatar
