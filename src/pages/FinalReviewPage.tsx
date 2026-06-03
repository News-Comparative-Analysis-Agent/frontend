import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Layout from '../layouts/Layout'
import Button from '../components/ui/Button'
import { useDraftStore } from '../stores/useDraftStore'
import { useUserStore } from '../stores/useUserStore'
import DOMPurify from 'dompurify'
import { fetchFinalReview, parsePreGeneratedDraft, type FinalReviewResponse } from '../api/finalReview'
import { fetchIssueDraft, fetchDraftCitations } from '../api/issues'
import { sanitizeDraftHtml, buildDraftHtml } from '../utils/buildDraftHtml'
import { buildMediaColorMap } from '../utils/mediaColors'

/** HTML 태그를 제거하고 순수 텍스트만 반환 */
const stripHtml = (html: string): string => {
  const doc = new DOMParser().parseFromString(html, 'text/html')
  return doc.body.textContent || ''
}

const FinalReviewPage = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const issueId = searchParams.get('id') || '1'
  const { title, content, setTitle, setContent } = useDraftStore()
  const { user } = useUserStore()
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

  // ── 새로고침 시 Zustand 스토어 유실 대응: 임시 저장된 초안 데이터 로드 ──
  useEffect(() => {
    if (!content && issueId) {
      const restoreDraft = async () => {
        try {
          const citData = await fetchDraftCitations(issueId)
          if (citData && citData.article_body) {
            const data = await fetchIssueDraft(issueId)
            const cards = data.claim_cards ?? []
            const allMedia = Array.from(new Set(cards.map(c => c.press))).filter(Boolean)
            
            const safeHtml = sanitizeDraftHtml(citData.article_body, allMedia)
            setTitle(citData.title || data.name || '')
            setContent(safeHtml, true)
          } else {
            // fallback: 일반 초안 데이터 불러오기
            const data = await fetchIssueDraft(issueId)
            if (data.pre_generated_draft) {
              let draft = data.pre_generated_draft
              if (typeof draft === 'string') {
                try {
                  draft = JSON.parse(draft)
                } catch {}
              }
              setTitle(draft.title || data.name || '')
              const mediaColorMap = buildMediaColorMap(Array.from(new Set((data.claim_cards ?? []).map(c => c.press))))
              const safeHtml = buildDraftHtml(draft, mediaColorMap)
              setContent(safeHtml, true)
            }
          }
        } catch (e) {
          console.error('검토 페이지에서 초안 복원 실패:', e)
        }
      }
      restoreDraft()
    }
  }, [content, issueId, setTitle, setContent])

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
    // 2. 하이라이트 태그 및 굵은 글씨(strong, b) 태그 제거 (텍스트는 유지)
    // 단, 이미지 블록([data-editor-image-id="tiptap"]) 내부의 구조(사진 및 출처 굵기 등)는 붕괴되지 않도록 보호합니다.
    const decorators = doc.querySelectorAll('span[class*="hl-"], span[class*="text-highlight-"], strong, b')
    decorators.forEach(el => {
      // 이미지 블록의 자식 요소이면 데코레이터 제거 대상에서 제외
      if (el.closest('[data-editor-image-id]')) {
        return;
      }
      el.replaceWith(...Array.from(el.childNodes))
    })
    
    const cleanedBody = doc.body.innerHTML
    
    return {
      resolvedTitle: title || draftFromApi?.title || reviewData?.name || '제목 없음',
      resolvedBody: cleanedBody,
      textLength: stripHtml(cleanedBody).length,
      safeContent: DOMPurify.sanitize(cleanedBody, {
        ADD_TAGS: ['span', 'h4', 'div', 'br', 'p', 'img'],
        ADD_ATTR: ['class', 'data-id', 'src', 'alt', 'data-editor-image-id', 'style']
      }),
    }
  }, [title, content, draftFromApi, reviewData?.name])

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
                  className="text-[18px] leading-[1.9] text-slate-800"
                  dangerouslySetInnerHTML={{ __html: safeContent }}
                />
              </article>
            </div>
          </div>
        </section>
      </main>

      {/* 하단 고정 액션 바 (Unified Standard) */}
      <div className="fixed bottom-0 left-0 right-0 h-14 md:h-16 border-t border-slate-200 bg-white/90 backdrop-blur-xl px-4 md:px-8 flex items-center justify-between z-[1000] shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
        <div className="flex items-center gap-3 flex-1 min-w-0 mr-4">
          <div className="size-2.5 rounded-full bg-slate-300 shrink-0"></div>
          <div className="flex flex-col min-w-0 text-left">
            <p className="hidden sm:block text-[13px] md:text-[15px] text-slate-600 font-medium tracking-tight truncate">발행 시 실제 뉴스 사이트에 적용될 레이아웃입니다.</p>
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
