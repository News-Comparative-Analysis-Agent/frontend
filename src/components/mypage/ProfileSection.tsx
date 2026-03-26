import { useUserStore } from '../../stores/useUserStore'

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
          <div className="size-28 rounded-full border-4 border-slate-50 shadow-inner overflow-hidden">
            {user?.avatar ? (
              <img alt="Profile" className="w-full h-full object-cover" src={user.avatar} />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary">
                <span className="material-symbols-outlined text-5xl">person</span>
              </div>
            )}
          </div>
          <button className="absolute bottom-0 right-0 bg-white border border-slate-200 size-8 rounded-full flex items-center justify-center text-slate-500 hover:text-primary shadow-sm transition-colors">
            <span className="material-symbols-outlined text-lg">photo_camera</span>
          </button>
        </div>

        {/* 회원 정보 */}
        <div className="flex-1 grid grid-cols-2 gap-x-8 gap-y-6">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">이름</label>
            <p className="text-lg font-bold text-slate-800">{user?.nickname ?? '-'}</p>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">소속 / 직책</label>
            <p className="text-lg font-bold text-slate-800">{user?.role ?? '-'}</p>
          </div>
          <div className="space-y-1.5 col-span-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">이메일 주소</label>
            <div className="flex items-center justify-between">
              <p className="text-lg font-medium text-slate-600">{user?.email ?? '-'}</p>
              <button className="px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-600 text-xs font-bold rounded-lg border border-slate-200 transition-colors">
                정보 수정
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ProfileSection
