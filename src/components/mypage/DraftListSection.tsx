import { useNavigate } from 'react-router-dom'
import { draftItems } from '../../mocks/mypageData'

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

      <div className="divide-y divide-slate-100 border-t border-slate-50">
        {draftItems.map((draft) => (
          <div
            key={draft.id}
            className="py-5 flex items-center justify-between group"
          >
            <div className="flex items-center gap-4">
              <div className="bg-slate-50 p-2 rounded-lg group-hover:bg-primary/5 transition-colors">
                <span className="material-symbols-outlined text-slate-400 group-hover:text-primary transition-colors">
                  description
                </span>
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-700 group-hover:text-primary transition-colors">
                  {draft.title}
                </h4>
                <p className="text-[12px] text-slate-400 mt-0.5 italic">{draft.lastModified}</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/drafting')}
              className="px-4 py-2 text-slate-600 hover:text-primary hover:bg-primary/5 border border-slate-200 hover:border-primary/20 rounded-lg text-sm font-bold flex items-center gap-1.5 transition-all whitespace-nowrap"
            >
              이어서 쓰기{' '}
              <span className="material-symbols-outlined text-lg">trending_flat</span>
            </button>
          </div>
        ))}
      </div>
    </section>
  )
}

export default DraftListSection
