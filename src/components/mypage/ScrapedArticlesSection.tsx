import { useNavigate } from 'react-router-dom'
import { scrapedArticles } from '../../mocks/mypageData'
import type { ScrapedArticle } from '../../mocks/mypageData'

const categoryStyle: Record<ScrapedArticle['categoryColor'], string> = {
  primary: 'bg-primary/10 text-primary',
  blue: 'bg-blue-50 text-blue-600',
}

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

      <div className="space-y-4">
        {scrapedArticles.map((article: ScrapedArticle) => (
          <div
            key={article.id}
            className="p-5 border border-slate-50 bg-slate-50/30 rounded-xl hover:border-primary/30 transition-all flex justify-between gap-6"
          >
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span
                  className={`px-2 py-0.5 text-[10px] font-bold rounded ${categoryStyle[article.categoryColor]}`}
                >
                  {article.category}
                </span>
                <span className="text-slate-400 text-[11px]">{article.scrapDate}</span>
              </div>
              <h4 className="text-[17px] font-bold text-slate-800 mb-2">{article.title}</h4>
              <p className="text-sm text-slate-500 leading-relaxed line-clamp-3">{article.summary}</p>
            </div>
            <div className="flex flex-col justify-end">
              <button onClick={() => navigate('/analysis')} className="px-5 py-2.5 bg-white border border-primary text-primary hover:bg-primary hover:text-white font-bold text-sm rounded-xl transition-all shadow-sm flex items-center gap-2 whitespace-nowrap">
                <span className="material-symbols-outlined text-lg">analytics</span>
                분석하기
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default ScrapedArticlesSection
