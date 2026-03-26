import { useNavigate } from 'react-router-dom'

/**
 * 스크랩한 기사 목록 섹션입니다.
 * TODO: 백엔드 API 연동 후 실제 스크랩 데이터를 불러옵니다.
 */
const ScrapedArticlesSection = () => {
  const navigate = useNavigate()

  return (
    <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-slate-800">스크랩한 기사</h3>
        <a className="text-xs font-bold text-slate-400 hover:text-primary transition-colors" href="#">
          전체보기{' '}
          <span className="material-symbols-outlined align-middle text-sm">chevron_right</span>
        </a>
      </div>

      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="size-16 rounded-2xl bg-slate-50 flex items-center justify-center mb-4">
          <span className="material-symbols-outlined text-slate-300 text-4xl">bookmark</span>
        </div>
        <p className="text-slate-500 font-bold mb-1">스크랩한 기사가 없습니다</p>
        <p className="text-sm text-slate-400 mb-6">관심 있는 기사를 스크랩하면 여기에 표시됩니다.</p>
        <button
          onClick={() => navigate('/')}
          className="px-5 py-2.5 bg-white border border-primary text-primary hover:bg-primary hover:text-white font-bold text-sm rounded-xl transition-all shadow-sm flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-lg">search</span>
          기사 탐색하기
        </button>
      </div>
    </section>
  )
}

export default ScrapedArticlesSection
