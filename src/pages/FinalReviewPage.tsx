import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Layout from '../layouts/Layout'
import Button from '../components/ui/Button'
import { useDraftStore } from '../stores/useDraftStore'
import { useUserStore } from '../stores/useUserStore'
import DOMPurify from 'dompurify'
import { fetchFinalReview, parsePreGeneratedDraft, type FinalReviewResponse } from '../api/finalReview'

/** HTML 태그를 제거하고 순수 텍스트만 반환 */
const stripHtml = (html: string): string => {
  const doc = new DOMParser().parseFromString(html, 'text/html')
  return doc.body.textContent || ''
}

/** 품질 점수 항목 설정 (정적 메타데이터) */
const QUALITY_SCORE_CONFIG = [
  { id: 'fairness', key: 'fairness', label: '공정성', icon: 'balance', defaultMax: 4, fallback: '공정성 평가 데이터가 없습니다.', warnThreshold: 2 },
  { id: 'factuality', key: 'faithfulness', label: '사실성', icon: 'fact_check', defaultMax: 4, fallback: '사실성 평가 데이터가 없습니다.', warnThreshold: 2 },
  { id: 'harmlessness', key: 'harmlessness', label: '무해성', icon: 'health_and_safety', defaultMax: 2, fallback: '무해성 평가 데이터가 없습니다.', warnThreshold: 0 },
] as const

const FinalReviewPage = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const issueId = searchParams.get('id') || '1'
  const { title, content } = useDraftStore()
  const { user } = useUserStore()
  const articleContentRef = useRef<HTMLDivElement | null>(null)
  const [reviewData, setReviewData] = useState<FinalReviewResponse | null>(null)
  const [reviewError, setReviewError] = useState<string | null>(null)

  // ── API 데이터 로드 ──
  useEffect(() => {
    let cancelled = false
    const loadFinalReview = async () => {
      try {
        const data = await fetchFinalReview(Number(issueId))
        if (!cancelled) {
          setReviewData(data)
          setReviewError(null)
        }
      } catch (error) {
        if (!cancelled) {
          setReviewError(error instanceof Error ? error.message : '최종 검토 데이터를 불러오지 못했습니다.')
        }
      }
    }
    loadFinalReview()
    return () => { cancelled = true }
  }, [issueId])

  // ── 파생 데이터 (메모이제이션) ──
  const draftFromApi = useMemo(
    () => parsePreGeneratedDraft(reviewData?.pre_generated_draft),
    [reviewData?.pre_generated_draft]
  )

  const { resolvedTitle, resolvedBody, textLength, safeContent } = useMemo(() => {
    let body = content || draftFromApi?.article_body || ''
    
    // ── 최종 검토용 클리닝: 인용 마커, 하이라이트, 굵은 글씨 제거 (실제 기사처럼 평이하게) ──
    const parser = new DOMParser()
    const doc = parser.parseFromString(body, 'text/html')
    
    // 1. [1], [2] 형태의 인용 마커 완전 제거
    doc.querySelectorAll('.citation-marker').forEach(el => el.remove())
    
    // 2. 하이라이트 태그 및 굵은 글씨(strong, b) 태그 제거 (텍스트는 유지)
    // - span[class*="hl-"]: 배경색 하이라이트
    // - strong, b: 굵은 글씨 강조 (언론사명 등)
    const decorators = doc.querySelectorAll('span[class*="hl-"], span[class*="text-highlight-"], strong, b')
    decorators.forEach(el => {
      el.replaceWith(...Array.from(el.childNodes))
    })
    
    const cleanedBody = doc.body.innerHTML
    
    return {
      resolvedTitle: title || draftFromApi?.title || reviewData?.name || '제목 없음',
      resolvedBody: cleanedBody,
      textLength: stripHtml(cleanedBody).length,
      safeContent: DOMPurify.sanitize(cleanedBody),
    }
  }, [title, content, draftFromApi, reviewData?.name])

  const detectedWords = useMemo(
    () => reviewData?.scores?.hate_speech_list ?? [],
    [reviewData?.scores?.hate_speech_list]
  )

  const qualityScores = useMemo(
    () => QUALITY_SCORE_CONFIG.map((cfg) => {
      const scoreData = reviewData?.scores?.[cfg.key as keyof typeof reviewData.scores] as
        | { score: number; max_score: number; detail: string }
        | undefined
      return {
        id: cfg.id,
        label: cfg.label,
        icon: cfg.icon,
        score: scoreData?.score ?? 0,
        total: scoreData?.max_score ?? cfg.defaultMax,
        description: scoreData?.detail ?? cfg.fallback,
        warnThreshold: cfg.warnThreshold,
      }
    }),
    [reviewData?.scores]
  )

  // ── 이벤트 핸들러 ──
  const scrollToDetectedWord = useCallback((word: string) => {
    const articleRoot = articleContentRef.current
    if (!articleRoot) return

    const target = Array.from(articleRoot.querySelectorAll('p, li, div, span')).find(
      (el) => el.textContent?.trim()?.includes(word)
    )
    if (!target) return

    target.scrollIntoView({ behavior: 'smooth', block: 'center' })
    const htmlEl = target as HTMLElement
    const original = htmlEl.style.backgroundColor
    htmlEl.style.backgroundColor = 'rgba(242, 107, 67, 0.16)'
    setTimeout(() => { htmlEl.style.backgroundColor = original }, 1500)
  }, [])

  // ── 렌더링 ──
  return (
    <Layout variant="white" activeStep={4} hideFooter>
      {/* Breadcrumb */}
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

      <main className="flex-1 flex flex-col md:flex-row min-h-0 animate-page-in overflow-hidden">
        <section className="flex-1 overflow-y-auto custom-scrollbar flex flex-col min-h-0 text-left bg-slate-50/30">
          {/* Full-width Header Section */}
          <div className="w-full bg-white relative animate-fade-in-up shrink-0">
            <div className="max-w-[900px] mx-auto pt-16 pb-16 px-8 md:px-16 text-left">
              <h2 className="text-3xl md:text-[40px] font-bold text-slate-900 leading-[1.2] mb-6 tracking-tight break-keep">
                {resolvedTitle}
              </h2>
              
              {/* 이슈 요약 섹션 제거됨 */}

              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-8 text-slate-800 text-[13px] font-light">
                <div className="flex items-center gap-2">
                  <div className="size-6 rounded-full bg-slate-50 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[14px] text-slate-400">person</span>
                  </div>
                  <span className="text-slate-800 font-medium">{user?.nickname ?? 'Guest 개발자'}</span>
                </div>
                <span className="hover:text-primary transition-colors cursor-pointer">{user?.email ?? 'dev@test.com'}</span>
                <span className="tracking-tight">입력 {new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\. /g, '.')} {new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false })}</span>
              </div>

              {/* Zigzag Divider (Absolute inside relative header) */}
              <div className="zigzag-divider" />
            </div>
          </div>

          {/* Full-width Body Section */}
          <div className="w-full bg-[#f5f5f5] flex-1">
            <div className="max-w-[900px] mx-auto px-8 md:px-16 pt-16 pb-32 text-left">
              <article className="article-content font-light review-clean-mode">
                <div
                  ref={articleContentRef}
                  className="space-y-8 text-[18px] leading-[1.9] text-slate-800"
                  dangerouslySetInnerHTML={{ __html: safeContent }}
                />
              </article>
            </div>
          </div>
        </section>

        <aside className="w-full md:w-[320px] lg:w-[420px] border-t md:border-t-0 md:border-l border-slate-200 bg-slate-50 shadow-[-10px_0_30px_-15px_rgba(0,0,0,0.05)] shrink-0 md:h-full overflow-y-auto custom-scrollbar select-none text-left z-10">
          {/* 고정 타이틀 바 */}
          <div className="sticky top-0 z-30 bg-white px-4 py-6 mb-2">
              <div className="flex items-center gap-2 relative">
                <h2 className="text-[22px] font-bold text-slate-800 tracking-tight leading-none">
                  최종 검토 결과
                </h2>
                <button type="button" className="inline-flex items-center justify-center p-1 rounded-full hover:bg-slate-50 transition-colors group">
                  <span className="material-symbols-outlined text-[20px] text-slate-300 group-hover:text-primary transition-colors">info</span>
                </button>
              </div>
              {/* Zigzag Divider for Sidebar */}
              <div className="zigzag-divider" />
          </div>

          <div className="px-4 pb-24 pt-4">
            {!reviewData ? (
              /* ── 현재 레이아웃에 맞춘 스켈레톤 ── */
              <div className="space-y-2 animate-pulse">
                {/* 상단 안내 바 */}
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="size-3.5 bg-slate-200 rounded-full animate-spin" />
                  <div className="h-2.5 w-24 bg-slate-200 rounded" />
                </div>

                {/* 품질 카드 스켈레톤 (3건) - 실제 카드 구조 반영 */}
                <div className="space-y-1.5 pt-1">
                  {[0, 1, 2].map((i) => (
                    <div key={i} className="bg-white border border-slate-200 rounded-xl px-3.5 py-2 flex items-start gap-3">
                      <div className="flex-1 space-y-2">
                        <div className="h-3.5 w-12 bg-slate-100 rounded-full" />
                        <div className="h-7 w-full bg-slate-50/50 rounded-lg" />
                      </div>
                      <div className="w-[70px] space-y-1.5 pt-1">
                        <div className="h-6 w-12 bg-slate-100 rounded ml-auto" />
                        <div className="h-2 w-8 bg-slate-50 rounded ml-auto" />
                      </div>
                    </div>
                  ))}
                </div>

                {/* 위험 경고 카드 스켈레톤 */}
                <div className="bg-amber-50/50 border border-amber-100 rounded-xl px-3 py-2 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="h-3 w-20 bg-amber-100 rounded" />
                    <div className="h-3 w-10 bg-amber-100 rounded" />
                  </div>
                  <div className="h-7 w-full bg-white/60 rounded-lg" />
                </div>

                {/* AI 의견 카드 스켈레톤 */}
                <div className="bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="h-3 w-24 bg-slate-200 rounded" />
                    <div className="h-5 w-10 bg-slate-200 rounded" />
                  </div>
                  <div className="h-10 w-full bg-white/40 rounded-lg" />
                </div>
              </div>
            ) : (
              /* ── 실제 리포트 콘텐츠 ── */
              <div className="space-y-1.5">
                {/* 품질 점수 카드 */}
                <div className="space-y-2">
                  {qualityScores.map((item) => (
                    <div key={item.id} className="bg-white border border-slate-200 rounded-xl shadow-sm px-3.5 py-2">
                      <div className="flex items-start gap-3">
                        <div className="flex-1 min-w-0 flex flex-col items-start gap-1">
                          <div className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${item.score <= item.warnThreshold ? 'bg-amber-400/80 text-amber-900' : 'bg-lime-300/80 text-lime-900'}`}>
                            <span className="material-symbols-outlined text-[14px]">{item.icon}</span>
                            {item.label}
                          </div>
                          <div className="w-full bg-slate-50/50 border border-slate-100 rounded-lg p-2 mt-0.5">
                            <p className="text-[11px] leading-[1.4] text-slate-500 text-left break-keep">{item.description}</p>
                          </div>
                        </div>
                        <div className="w-[70px] shrink-0 text-right">
                          <div className="flex items-baseline justify-end gap-0.5">
                            <span className="text-[28px] leading-none font-black tracking-tight text-slate-900">{item.score}</span>
                            <span className="text-[14px] font-black text-slate-900">점</span>
                          </div>
                          <div className="mt-0.5 text-[9px] font-semibold text-slate-400">만점 {item.total}점</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* 위험 요소 경고 */}
                <div className="bg-amber-50 border border-amber-200 rounded-xl shadow-sm overflow-hidden">
                  <div className="px-3 py-2 border-b border-amber-100 bg-amber-100/20 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="size-6 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-amber-600 text-[14px] font-bold">warning</span>
                      </div>
                      <h4 className="font-bold text-[12px] text-amber-900 tracking-tight">위험 요소 경고</h4>
                    </div>
                    <div className={`px-2 py-0.5 rounded-lg text-[10px] font-bold ${detectedWords.length > 0 ? 'bg-amber-500 text-white' : 'bg-amber-200/50 text-amber-600'}`}>
                      {detectedWords.length > 0 ? `${detectedWords.length}건 감지` : '이상 없음'}
                    </div>
                  </div>
                  <div className="px-3 py-2">
                    <div className={`rounded-lg p-2 border text-left ${detectedWords.length > 0 ? 'bg-white/60 border-amber-200' : 'bg-white/40 border-amber-100'}`}>
                      <p className="text-[11px] text-slate-600 leading-[1.5] font-medium">
                        {detectedWords.length > 0 ? '본문에 부적절하거나 공격적인 단어가 감지되었습니다.' : '현재 검출된 부적절 표현이 없습니다.'}
                      </p>
                      {detectedWords.length > 0 && (
                        <div className="mt-2 pt-2 border-t border-amber-100">
                          <div className="flex flex-wrap gap-1.5">
                            {detectedWords.map((word) => (
                              <button key={word} type="button" onClick={() => scrollToDetectedWord(word)} className="px-2.5 py-1 rounded-full bg-amber-100 border border-amber-200 text-amber-800 text-[13px] font-black hover:bg-amber-200 transition-colors">{word}</button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* AI 최종 종합 의견 */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-xl overflow-hidden">
                  <div className="px-3 py-2 border-b border-slate-800 bg-slate-900 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="size-6 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-primary text-[14px] font-bold">psychology</span>
                      </div>
                      <h4 className="font-bold text-[12px] text-white tracking-tight">AI 최종 종합 의견</h4>
                    </div>
                    <div className="flex items-baseline gap-0.5 bg-white/10 rounded-lg px-2 py-1">
                      <span className="text-[28px] font-black text-white leading-none">{reviewData?.scores?.total_score ?? 0}</span>
                      <span className="text-[14px] font-black text-slate-300">점</span>
                    </div>
                  </div>
                  <div className="px-3 py-2">
                    <div className="bg-white/5 rounded-lg p-3 border border-white/5 text-left">
                      <div className="flex items-start gap-2">
                        <span className="text-white/10 font-black text-[20px] leading-none shrink-0 -mt-1">"</span>
                        <p className="text-[11px] text-slate-300 leading-[1.6] font-medium flex-1">{reviewData?.ai_opinion ?? 'AI 종합 의견을 불러오는 중입니다.'}</p>
                        <span className="text-white/10 font-black text-[20px] leading-none shrink-0 self-end -mb-1">"</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 오류 메시지 */}
                {reviewError && (
                  <div className="bg-rose-50 border border-rose-200 rounded-xl px-3 py-2 text-[11px] text-rose-700 font-medium mt-2">{reviewError}</div>
                )}
              </div>
            )}
          </div>
        </aside>
      </main>

      {/* 하단 고정 액션 바 (Unified Standard) */}
      <div className="fixed bottom-0 left-0 right-0 h-14 md:h-16 border-t border-slate-200 bg-white/90 backdrop-blur-xl px-4 md:px-8 flex items-center justify-between z-[1000] shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
        <div className="flex items-center gap-3 flex-1 min-w-0 mr-4">
          <div className="size-2.5 rounded-full bg-slate-300 shrink-0"></div>
          <div className="flex flex-col min-w-0 text-left">
            <p className="text-[13px] md:text-[15px] font-bold text-slate-800 tracking-tight leading-tight">최종 검토 중</p>
            <p className="hidden sm:block text-[11px] md:text-[12px] text-slate-500 font-medium tracking-tight mt-0.5 truncate">발행 시 실제 뉴스 사이트에 적용될 레이아웃입니다.</p>
          </div>
        </div>
        <div className="flex items-center gap-2 md:gap-3 shrink-0">
          <Button variant="outline" icon="edit" onClick={() => navigate(`/drafting?id=${issueId}`)} className="h-8 md:h-10 px-3 md:px-4 text-[12px] md:text-[14px] font-bold transition-all">수정</Button>
          <Button icon="publish" className="h-8 md:h-10 px-6 md:px-10 text-[12px] md:text-[14px] font-bold shadow-lg hover:shadow-primary/20 transition-all">최종 발행</Button>
        </div>
      </div>
    </Layout>
  )
}

export default FinalReviewPage
