import { useState } from 'react'
import Layout from '../layouts/Layout'
import ProfileSection from '../components/mypage/ProfileSection'
import DraftListSection from '../components/mypage/DraftListSection'

type TabId = 'profile' | 'drafts'

interface SidebarTab {
  id: TabId
  label: string
  icon: string
}

const TABS: SidebarTab[] = [
  { id: 'profile', label: '회원 정보 수정', icon: 'person' },
  { id: 'drafts', label: '임시 저장 초안', icon: 'edit_note' },
]

const MyPage = () => {
  const [activeTab, setActiveTab] = useState<TabId>('profile')

  return (
    <Layout variant="white">
      <div className="max-w-[1280px] w-full mx-auto flex gap-8 px-6 md:px-12 lg:px-24 py-10">
        {/* 사이드바 */}
        <aside className="w-60 flex-shrink-0 hidden md:block">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden py-4 sticky top-24">
            <nav className="flex flex-col">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-4 flex items-center gap-3 text-left transition-all ${
                    activeTab === tab.id
                      ? 'bg-primary/10 text-primary border-r-4 border-primary font-bold'
                      : 'text-slate-500 hover:bg-slate-50 hover:text-primary'
                  }`}
                >
                  <span className="material-symbols-outlined">{tab.icon}</span>
                  <span className="text-[15px]">{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* 모바일 탭 */}
        <div className="md:hidden w-full mb-4">
          <div className="flex bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-3 flex flex-col items-center gap-1 text-xs font-bold transition-all ${
                  activeTab === tab.id
                    ? 'bg-primary/10 text-primary border-b-2 border-primary'
                    : 'text-slate-400 hover:text-primary'
                }`}
              >
                <span className="material-symbols-outlined text-lg">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* 콘텐츠 영역 */}
        <div className="flex-1 space-y-8 min-w-0">
          {activeTab === 'profile' && <ProfileSection />}
          {activeTab === 'drafts' && <DraftListSection />}
        </div>
      </div>
    </Layout>
  )
}

export default MyPage
