import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../layouts/Layout'
import Button from '../components/ui/Button'
import SectionHeader from '../components/ui/SectionHeader'

const FinalReviewPage = () => {
  const navigate = useNavigate()
  const [highlightedId, setHighlightedId] = useState<string | null>(null)

  const highlightTarget = (id: string | null) => {
    setHighlightedId(id)
    if (id) {
      const element = document.getElementById(id)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    }
  }

  return (
    <Layout variant="primary" activeStep={4} hideFooter>
      <div className="bg-white border-b border-slate-50 px-4 md:px-8 py-3 shrink-0">
        <div className="flex items-center gap-2 text-[12px] font-medium text-slate-400">
          <span className="material-symbols-outlined text-[16px]">home</span>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          <span>심층 분석</span>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          <span>초안 작성</span>
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
                <div className="bg-slate-900 text-white px-2 py-0.5 text-[10px] font-bold tracking-widest uppercase rounded">Politics Focus</div>
                <div className="h-3 w-px bg-slate-200 mx-1"></div>
                <span className="text-xs text-slate-500 font-medium tracking-tight">정치 / 정당 행정 섹션</span>
              </div>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900 leading-[1.3] mb-8 tracking-tight text-left">
                민주당-조국혁신당 합당 추진 전격 중단… 계파 갈등 속 '정청래식 리더십' 도마 위
              </h2>
              <div className="flex items-center justify-between py-4 border-y border-slate-100">
                <div className="flex items-center gap-4">
                  <div className="flex flex-col text-left">
                    <span className="text-xs font-bold text-slate-800">김태현 기자</span>
                    <span className="text-[11px] text-slate-400">politics_editor@insight-hub.com</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-500 block">발행 일시</span>
                  <span className="text-xs font-medium text-slate-800 tracking-tight">2024년 05월 24일 17:00 예정</span>
                </div>
              </div>
            </div>
            <article className="px-6 md:px-10 py-8">
              <div className="mb-10 group relative">
                <img alt="Article Image" className="w-full rounded-lg object-cover max-h-[450px]" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDY33rzUtzizNkambfkpf7PrbmaCPi3Vs2XhrFST7J9j0Auo6ROoJdI99n39p8kX3QyEEUtTFw75VImv0O4NvrIXq7CP2ZKyO8NbkqCkZWvxbEuti95lCCVBtBSHUVRbhJUC4-VdAA96qxNc_KRHTo_MGtnkhEZxjymY8608LA8RGNGJcovh3J3VhAUB4vyUA2L3SC7YvAK7EHrW114yDftkTUpbD47aXsHvTyjTFWeLDGYtAqFdkUtvQPbmkio8Z-MJGKA70SaKR0" />
                <p className="mt-3 text-[13px] text-slate-500 text-center leading-relaxed italic">
                  ▲ 지난 비공개 최고위원회의에서 합당 논의 중단 결정을 발표하고 있는 더불어민주당 지도부의 모습. (사진=인사이트 허브)
                </p>
              </div>
              <div className="space-y-6 text-[17px] leading-[1.85] text-slate-800 text-left">
                <p>
                  더불어민주당 정청래 최고위원이 제안한 조국혁신당과의 합당 추진이 당내 거센 반발에 직면하며 19일 만에 공식 중단되었습니다. 이번 사태는 정당 간의 물리적 결합이라는 의미를 넘어, 당내 의사결정 구조의 투명성과 리더십의 정당성에 대한 근본적인 의문을 제기하고 있습니다.
                </p>
                <p>
                  <span 
                    id="target-span-plagiarism" 
                    className={`transition-all duration-300 ${highlightedId === 'target-span-plagiarism' ? 'bg-red-100 text-red-900 font-bold px-1 rounded ring-1 ring-red-300' : ''}`}
                  >
                    경향신문을 비롯한 진보 성향 매체들은 "충분한 내부 소통 없는 독단적 추진이 부른 예고된 참사"라고 정의하며
                  </span>, 당내 민주주의 시스템의 훼손을 경고했습니다. 특히 호남 지역구 의원들을 중심으로 한 계파 갈등이 수면 위로 부상하며 차기 지방선거 공천권을 둘러싼 당내 내홍이 격화될 조짐을 보이고 있습니다.
                </p>
                <p>
                  반면 조선일보 등 보수 언론은 이번 사태의 본질을 '내부 권력 투쟁'으로 규정했습니다. <span 
                    id="target-span-adjective" 
                    className={`transition-all duration-300 ${highlightedId === 'target-span-adjective' ? 'bg-red-100 text-red-900 font-bold px-1 rounded ring-1 ring-red-300' : ''}`}
                  >
                    정 최고위원이 자신의 정치적 입지를 강화하기 위해 '합당 카드'를 꺼내들었으나
                  </span>, 실질적인 득실 계산이 끝난 타 계파의 저항에 부딪혀 낙마했다는 분석입니다. 이러한 이해관계의 충돌은 야권 통합의 진정성을 희석시키고 있다는 지적입니다.
                </p>
                <p>
                  결론적으로 이번 합당 무산은 단순한 논의의 중단을 넘어, 민주당 리더십의 중대한 시험대가 될 전망입니다. 산적한 민생 현안 속에서 불필요한 정치공학적 논란으로 인한 국정 동력 소모를 막기 위해, 보다 투명하고 합리적인 거버넌스 구축이 시급한 시점입니다.
                </p>
              </div>
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
            icon="analytics" 
            title="최종 품질 검토 리포트" 
            className="mb-4"
            titleSize="sm"
          />

          <div className="space-y-4">
            {/* Reliability Card */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-xl">verified_user</span>
                  <h4 className="font-bold text-sm text-slate-800 tracking-tight">신뢰도 및 표절 분석</h4>
                </div>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-12 gap-4">
                  <div 
                    className="col-span-5 bg-red-50 rounded-xl p-3 border border-red-100 flex flex-col items-center group cursor-pointer"
                    onMouseEnter={() => highlightTarget('target-span-plagiarism')}
                    onMouseLeave={() => highlightTarget(null)}
                  >
                    <span className="text-[10px] font-bold text-red-500 uppercase mb-2 tracking-tight text-center">표절률 위험</span>
                    <div className="relative w-[60px] h-[60px]">
                      <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                        <path className="text-slate-200" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3"></path>
                        <path className="text-red-500" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeDasharray="24, 100" strokeLinecap="round" strokeWidth="3"></path>
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-sm font-bold text-red-600">24%</span>
                      </div>
                    </div>
                  </div>
                  <div className="col-span-7 space-y-2 text-left">
                    <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs">list_alt</span>
                      유사 기사 소스 (3건)
                    </h5>
                    <div className="bg-slate-50 border border-slate-100 rounded-lg p-2.5 hover:border-red-200 transition-all cursor-pointer">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-[9px] font-bold text-slate-500">중앙일보</span>
                        <span className="text-[10px] font-bold text-red-600">85%</span>
                      </div>
                      <h5 className="text-[10px] font-bold text-slate-700 leading-tight truncate">"정청래 최고위원 합당 제안 반발..."</h5>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Ethics Card */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-green-600 text-xl">gavel</span>
                  <h4 className="font-bold text-sm text-slate-800 tracking-tight">윤리 가이드라인 검증</h4>
                </div>
                <span className="flex items-center gap-1 text-red-600 text-[10px] font-bold bg-red-50 px-2 py-0.5 rounded border border-red-100">
                  <span className="material-symbols-outlined text-[12px] font-bold">warning</span>
                  CAUTION
                </span>
              </div>
              <div className="p-4 space-y-2 text-left">
                <div className="flex items-center gap-3 text-xs font-medium text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <span className="material-symbols-outlined text-green-500 text-xl font-bold">check_circle</span>
                  혐오 표현 및 차별적 서술 없음
                </div>
                <div 
                  className="flex items-center gap-3 text-xs font-bold text-red-600 bg-red-50/50 p-2.5 rounded-xl border border-red-100 cursor-pointer group"
                  onMouseEnter={() => highlightTarget('target-span-adjective')}
                  onMouseLeave={() => highlightTarget(null)}
                >
                  <span className="material-symbols-outlined text-red-500 text-xl font-bold group-hover:scale-110 transition-transform">error</span>
                  자극적인 형용사 사용 감지 (보안 권장)
                </div>
              </div>
            </div>

            {/* AI Opinion Card - Black Theme */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-800 bg-slate-900 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-xl">psychology</span>
                  <h4 className="font-bold text-sm text-white tracking-tight">AI 최종 종합 의견</h4>
                </div>
              </div>
              <div className="px-5 py-3">
                <div className="bg-white/5 rounded-xl p-4 border border-white/5 text-left">
                  <p className="text-[12px] text-slate-300 leading-[1.7] font-medium">
                    <span className="flex items-center gap-1.5 mb-2 text-primary font-bold">
                      <span className="material-symbols-outlined text-base">magic_button</span>
                      품질 개선 권고: 보완이 필요합니다
                    </span>
                    문맥상 <span className="text-red-400 font-bold">두 번째 문단</span>의 유사도가 다소 높게 측정되었습니다. <span className="text-primary font-bold underline underline-offset-4 decoration-primary/30">감성적 서술</span>을 조금 더 객관적인 지표로 대체하여 기사의 신뢰도를 높이는 것을 추천드립니다.
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
            onClick={() => navigate('/drafting')} 
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
