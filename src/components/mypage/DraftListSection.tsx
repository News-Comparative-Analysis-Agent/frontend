import { useNavigate } from 'react-router-dom'

/**
 * 임시 저장 초안 목록 섹션입니다.
 * TODO: 백엔드 API 연동 후 실제 초안 목록을 불러옵니다.
 */
const DraftListSection = () => {
  const navigate = useNavigate()

  return (
    <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-slate-800">임시 저장 초안</h3>
        <a className="text-xs font-bold text-slate-400 hover:text-primary transition-colors" href="#">
          전체보기{' '}
          <span className="material-symbols-outlined align-middle text-sm">chevron_right</span>
        </a>
      </div>

      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="size-16 rounded-2xl bg-slate-50 flex items-center justify-center mb-4">
          <span className="material-symbols-outlined text-slate-300 text-4xl">edit_note</span>
        </div>
        <p className="text-slate-500 font-bold mb-1">저장된 초안이 없습니다</p>
        <p className="text-sm text-slate-400 mb-6">작성 중인 초안을 임시 저장하면 여기에 표시됩니다.</p>
        <button
          onClick={() => navigate('/')}
          className="px-4 py-2 text-slate-600 hover:text-primary hover:bg-primary/5 border border-slate-200 hover:border-primary/20 rounded-lg text-sm font-bold flex items-center gap-1.5 transition-all"
        >
          새 기사 작성하기{' '}
          <span className="material-symbols-outlined text-lg">trending_flat</span>
        </button>
      </div>
    </section>
  )
}

export default DraftListSection
