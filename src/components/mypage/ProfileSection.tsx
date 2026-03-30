import { useUserStore } from '../../stores/useUserStore'
import UserAvatar from '../ui/UserAvatar'
import ProfileInfoField from './ProfileInfoField'

const ProfileSection = () => {
  const { user } = useUserStore()

  return (
    <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
      <div className="flex items-center justify-between mb-8 border-b border-slate-50 pb-6">
        <h3 className="text-xl font-bold text-slate-800">회원 정보 수정</h3>
        <button className="text-sm font-bold text-primary hover:underline flex items-center gap-1">
          <span className="material-symbols-outlined text-lg">lock</span>
          비밀번호 변경
        </button>
      </div>

      <div className="flex items-start gap-10">
        {/* 프로필 이미지 */}
        <div className="relative">
          <UserAvatar
            avatar={user?.avatar}
            size="lg"
            className="border-4 border-slate-50 shadow-inner"
          />
          <button className="absolute bottom-0 right-0 bg-white border border-slate-200 size-8 rounded-full flex items-center justify-center text-slate-500 hover:text-primary shadow-sm transition-colors">
            <span className="material-symbols-outlined text-lg">photo_camera</span>
          </button>
        </div>

        {/* 회원 정보 */}
        <div className="flex-1 grid grid-cols-2 gap-x-8 gap-y-6">
          <ProfileInfoField label="이름" value={user?.nickname} />
          {/* 소속 / 직책 필드 제거됨 */}
          <ProfileInfoField label="이메일 주소" colSpan={2}>
            <div className="flex items-center justify-between">
              <p className="text-lg font-medium text-slate-600">{user?.email ?? '-'}</p>
              <button className="px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-600 text-xs font-bold rounded-lg border border-slate-200 transition-colors">
                정보 수정
              </button>
            </div>
          </ProfileInfoField>
        </div>
      </div>
    </section>
  )
}

export default ProfileSection
