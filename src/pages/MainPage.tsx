import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../layouts/Layout'
import { mainNewsData, commonPopularNews } from '../mocks/newsData'
import Button from '../components/ui/Button'
import SectionHeader from '../components/ui/SectionHeader'
import StepIndicator from '../components/ui/StepIndicator'
import FilterChip from '../components/ui/FilterChip'
import { ArticleCard } from '../components/main/ArticleCard'

const MainPage = () => {
  const navigate = useNavigate()
  const [selectedMedia, setSelectedMedia] = useState<string[]>(['조선일보', '한겨레'])

  const handleMediaChange = (media: string) => {
    const allMedia = ['조선일보', '한겨레', '경향신문', '동아일보', '연합뉴스']
    if (media === '전체') {
      setSelectedMedia(selectedMedia.length === allMedia.length ? [] : allMedia)
      return
    }
    setSelectedMedia(prev => 
      prev.includes(media) ? prev.filter(m => m !== media) : [...prev, media]
    )
  }

  const steps = [
    { number: 1, title: '주제 선택', description: '분석할 주제를 선택하거나 직접 검색합니다.', path: '/', isActive: true },
    { number: 2, title: '심층 분석', description: '진보/보수 관점을 비교 분석합니다.', path: '/analysis' },
    { number: 3, title: '초안 작성', description: 'AI가 기사 초안을 작성합니다.', path: '/drafting' },
    { number: 4, title: '최종 발행', description: '기사 품질 검토 후 발행합니다.', path: '/final-review' },
  ]

  return (
    <Layout>
      <div className="animate-page-in">
        <section className="bg-primary h-[190px] px-12 flex flex-col justify-center">
          <div className="max-w-[1240px] w-full mx-auto flex items-center justify-between gap-24">
            <div className="flex-1 text-left shrink-0">
              <h2 className="text-4xl font-extrabold text-white tracking-tight leading-[1.3] break-keep">
                기사 작성의 모든 과정,<br />실시간으로 도와드립니다.
              </h2>
              <p className="text-white/70 mt-3 text-sm font-medium">기자님을 위한 실시간 이슈 트래킹 및 분석 가이드입니다.</p>
            </div>
            <StepIndicator steps={steps} />
          </div>
        </section>

        <div className="max-w-[1100px] mx-auto px-6 pt-7">
          <div className="flex items-center justify-between border-b-2 border-slate-900/5 pb-6">
            <SectionHeader 
              icon="trending_up" 
              title="오늘의 뉴스 트렌드" 
              description="2026년 2월 23일 기준 실시간 분석 결과입니다" 
            />
            <div className="flex items-center gap-3">
              <div className="relative w-64 focus-within:w-80 transition-all duration-500 ease-out group">
                <input 
                  id="search-input" 
                  className="w-full pl-11 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all bg-white shadow-sm placeholder:text-slate-400" 
                  placeholder="찾는 뉴스가 있으신가요?" 
                  type="text" 
                  onKeyDown={(e) => e.key === 'Enter' && navigate('/search')}
                />
                <span 
                  className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-[20px] group-focus-within:text-primary group-focus-within:scale-110 transition-all cursor-pointer" 
                  onClick={() => navigate('/search')}
                >
                  search
                </span>
              </div>
              <Button 
                variant="icon" 
                size="icon" 
                icon="search" 
                onClick={() => navigate('/search')}
              />
            </div>
          </div>
        </div>

        <div className="max-w-[1100px] mx-auto px-6 pb-20 pt-8">
          <div className="flex flex-col xl:flex-row gap-16 items-start">
            <div className="w-full xl:w-[55%] flex flex-col">
              <div className="mb-10 text-left">
                <h2 className="text-slate-800 text-xl font-bold tracking-tight section-highlight mb-4">각 언론사별 현재 인기 뉴스에요</h2>
                <div className="w-full h-px bg-slate-100"></div>
              </div>

              <div className="mb-10 w-full">
                <div className="flex flex-nowrap gap-2 pb-2 no-scrollbar" id="filter-chips-container">
                  <FilterChip 
                    label="전체" 
                    checked={selectedMedia.length === 5} 
                    onChange={() => handleMediaChange('전체')} 
                  />
                  {['조선일보', '한겨레', '경향신문', '동아일보', '연합뉴스'].map(media => (
                    <FilterChip 
                      key={media}
                      label={media.replace('신문', '').replace('일보', '')}
                      checked={selectedMedia.includes(media)}
                      onChange={() => handleMediaChange(media)}
                    />
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-12">
                {mainNewsData.filter(board => selectedMedia.includes(board.category)).map(board => (
                  <div key={board.category} className="news-board-card text-left">
                    <div className={`border-t-[3px] ${board.borderColor} mb-3`}></div>
                    <h4 className="text-lg font-bold text-slate-600 flex items-center gap-1 mb-4">
                      {board.category} <span className="material-symbols-outlined text-sm">chevron_right</span>
                    </h4>
                    <div className="space-y-0 divide-y divide-slate-50">
                      {board.articles.map((article, idx) => (
                        <ArticleCard 
                          key={article.id}
                          article={article}
                          boardColor={board.color}
                          boardTextColor={board.textColor}
                          isFirst={idx === 0}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="w-full xl:w-[45%] border-l border-slate-100 pl-16 flex flex-col text-left">
              <div className="mb-10">
                <h2 className="text-slate-800 text-xl font-bold tracking-tight section-highlight mb-4">언론사 공통으로 다루는 이슈를 탐색하세요</h2>
                <div className="w-full h-px bg-slate-100"></div>
              </div>
              
              <div className="flex flex-col flex-1 divide-y divide-slate-100">
                <div className="news-board-card group cursor-pointer max-w-[400px] mb-3" onClick={() => navigate('/analysis')}>
                  <div className="border-t-[3px] border-primary mb-3"></div>
                  <h4 className="text-lg font-bold text-primary flex items-center gap-1 mb-4">이슈 통합 1위</h4>
                  <ArticleCard 
                    article={commonPopularNews[0]}
                    boardColor="bg-primary"
                    boardTextColor="text-primary"
                    isFirst={true}
                  />
                </div>

                <div className="divide-y divide-slate-50 bg-white">
                  {commonPopularNews.slice(1).map(article => (
                    <ArticleCard 
                      key={article.rank}
                      article={article}
                      boardColor="bg-primary"
                      boardTextColor="text-primary"
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default MainPage
