import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Layout from '../layouts/Layout'
import Button from '../components/ui/Button'
import SectionHeader from '../components/ui/SectionHeader'
import { useDraftStore } from '../stores/useDraftStore'
import { useUserStore } from '../stores/useUserStore'
import DOMPurify from 'dompurify'

const FinalReviewPage = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const issueId = searchParams.get('id') || '1'
  const { title, content } = useDraftStore()
  const { user } = useUserStore()

  // 데이터가 없으면 작성 페이지로 이동
  useEffect(() => {
    if (!title && !content) {
      navigate(`/drafting?id=${issueId}`)
    }
  }, [title, content, navigate, issueId])

  const safeContent = DOMPurify.sanitize(content)

  return (
    <Layout variant="white" activeStep={4} hideFooter>
      <div className="bg-white border-b border-slate-50 px-4 md:px-8 py-3 shrink-0">
        <div className="flex items-center gap-2 text-[12px] font-medium text-slate-400">
          <span className="material-symbols-outlined text-[16px] cursor-pointer hover:text-primary transition-colors" onClick={() => navigate('/')}>home</span>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          <span className="cursor-pointer hover:text-primary transition-colors" onClick={() => navigate(`/analysis?id=${issueId}`)}>심층 분석</span>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          <span className="cursor-pointer hover:text-primary transition-colors" onClick={() => navigate(`/drafting?id=${issueId}`)}>초안 작성</span>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          <span className="text-slate-800 font-bold">최종 검토</span>
        </div>
      </div>

      <main className="flex-1 flex flex-col lg:flex-row min-h-0 animate-page-in overflow-hidden">
        {/* Article Preview Section */}
        <section className="flex-1 overflow-y-auto custom-scrollbar flex flex-col items-center py-6 md:py-10 min-h-0 px-4 text-left">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/5 text-primary text-sm font-bold mb-8 border border-primary/10 text-left">
            <span className="material-symbols-outlined text-[16px]">info</span>
            현재 단계 : 최종 검토
          </div>
          <div className="w-full max-w-[800px] bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col mb-10">
            <div className="p-6 md:p-10 border-b border-slate-50">
              <div className="flex items-center gap-2 mb-6">
                <div className="bg-slate-900 text-white px-2 py-0.5 text-[10px] font-bold tracking-widest uppercase rounded">Politics FOC-US</div>
                <div className="h-3 w-px bg-slate-200 mx-1"></div>
                <span className="text-xs text-slate-500 font-medium tracking-tight">정치 / 정당 행정 섹션</span>
              </div>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900 leading-[1.3] mb-8 tracking-tight text-left">
                {title || '제목 없음'}
              </h2>
              <div className="flex items-center justify-between py-4 border-y border-slate-100">
                <div className="flex items-center gap-4">
                  <div className="flex flex-col text-left">
                    <span className="text-xs font-bold text-slate-800">{user?.nickname ?? '기자'}</span>
                    <span className="text-[11px] text-slate-400">{user?.email ?? 'editor@foc-us.com'}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-500 block">발행 일시</span>
                  <span className="text-xs font-medium text-slate-800 tracking-tight">
                    {new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })} 발행 예정
                  </span>
                </div>
              </div>
            </div>
            <article className="px-6 md:px-10 py-8">
              <div 
                className="space-y-6 text-[17px] leading-[1.85] text-slate-800 text-left article-content"
                dangerouslySetInnerHTML={{ __html: safeContent }}
              />
              <div className="mt-16 pt-8 border-t border-slate-100 text-left">
                <div className="bg-slate-50 border border-slate-200/60 rounded-lg p-4 flex items-center gap-3">
                  <span className="material-symbols-outlined text-slate-400 text-[20px]">info</span>
                  <p className="text-xs text-slate-500 font-medium">
                    본 기사는 <span className="text-slate-700 font-bold">AI 분석 시스템</span>을 통해 주요 언론사별 시각차를 교차 검증하여 작성된 초안을 바탕으로 기자가 최종 편집을 완료했습니다.
                  </p>
                </div>
              </div>
            </article>
          </div>
        </section>

        {/* Quality Review Sidebar */}
        <aside className="w-full lg:w-[420px] border-t lg:border-t-0 lg:border-l border-slate-200 bg-white p-5 pb-24 shrink-0 h-full overflow-y-hidden select-none text-left">
          <SectionHeader 
            icon="fact_check" 
            title="최종 품질 검토 리포트" 
            className="mb-4"
            titleSize="sm"
          />

          <div className="space-y-4">

            {/* Ethics Card */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="size-8 rounded-lg bg-green-50 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-green-600 text-[18px] font-bold">gavel</span>
                  </div>
                  <h4 className="font-bold text-sm text-slate-800 tracking-tight">윤리 가이드라인 검증</h4>
                </div>
              </div>
              <div className="p-4 space-y-2 text-left">
                <div className="flex items-center gap-2.5 text-xs font-medium text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <span className="material-symbols-outlined text-green-500 text-[18px] font-bold">check_circle</span>
                  <span className="flex-1 pt-0.5">혐오 표현 및 차별적 서술 없음 (검증 완료)</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs font-medium text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <span className="material-symbols-outlined text-green-500 text-[18px] font-bold">check_circle</span>
                  <span className="flex-1 pt-0.5">부적절한 형용사 및 편향적 단어 배제됨</span>
                </div>
              </div>
            </div>

            {/* AI Opinion Card - Black Theme */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-800 bg-slate-900 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="size-8 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-primary text-[18px] font-bold">psychology</span>
                  </div>
                  <h4 className="font-bold text-sm text-white tracking-tight">AI 최종 종합 의견</h4>
                </div>
              </div>
              <div className="px-5 py-3">
                <div className="bg-white/5 rounded-xl p-4 border border-white/5 text-left">
                  <p className="text-[12px] text-slate-300 leading-[1.7] font-medium">
                    <span className="flex items-center gap-1.5 mb-2 text-primary font-bold text-[13px]">
                      <span className="material-symbols-outlined text-[16px]">verified</span>
                      품질 검증이 완료되었습니다
                    </span>
                    기사의 인용 근거와 팩트 체크가 시스템적으로 검증되었습니다. 각 언론사의 다양한 시각을 균형 있게 반영하고 있으며, 최종 발행이 가능한 수준의 품질이 확보되었습니다.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </main>

      <div className="fixed bottom-0 left-0 right-0 h-20 border-t border-slate-200 bg-white/90 backdrop-blur-xl px-4 md:px-8 flex items-center justify-between z-[1000] shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
        <div className="flex items-center gap-2 text-slate-400">
          <span className="material-symbols-outlined text-[20px]">visibility</span>
          <span className="text-[12px] font-medium tracking-tight whitespace-nowrap">발행 시 실제 뉴스 사이트에 적용될 레이아웃입니다.</span>
        </div>
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            icon="edit"
            onClick={() => navigate(`/drafting?id=${issueId}`)} 
            className="px-8"
          >
            수정하러 돌아가기
          </Button>
          <Button 
            size="lg"
            icon="publish"
            className="px-10"
          >
            최종 발행 확정
          </Button>
        </div>
      </div>
    </Layout>
  )
}

export default FinalReviewPage
