import DOMPurify from 'dompurify'
import { PreGeneratedDraft } from '../types/analysis'

interface MediaColorScheme {
  hl: string
  [key: string]: string
}

/**
 * 백엔드 데이터 순서를 최대한 존중하여 초안 HTML을 생성합니다.
 */
export const buildDraftHtml = (
  draft: any,
  mediaColorMap: Record<string, MediaColorScheme>
): string => {
  let html = ''
  let mediaViewsRendered = false;

  // 1. 도입부 (있을 경우만)
  const intro = draft.intro || draft.introduction || ''
  if (intro) {
    html += `<p class="mb-5 font-medium text-slate-800">${intro}</p>`;
  }

  // 2. 언론사 공방 요약 (있을 경우만)
  if (draft.conflict_summary) {
    html += `<p class="mb-5 text-slate-700">${draft.conflict_summary}</p>`;
  }

  // 3. 언론사별 개별 입장 (media_views) - 백엔드 순서상 본문 앞에 위치하는 경우가 많음
  const rootMediaViews = draft.media_views || [];
  if (rootMediaViews.length > 0) {
    mediaViewsRendered = true;
    rootMediaViews.forEach((view: any) => {
      const scheme = mediaColorMap[view.press]
      const hlClass = scheme ? scheme.hl : 'hl-neutral'
      // 하이라이트 + 원본 narrative 만 노출 (순서 존중)
      html += `<p class="mb-4 leading-relaxed"><span class="${hlClass}">${view.press || ''}</span> ${view.narrative || ''}</p>`
    });
  }

  // 4. 계층형 섹션 (sections/contentions) - 순서상 중간에 위치
  const sections = draft.sections || draft.contentions || []
  sections.forEach((section: any) => {
    const title = section.section_title || section.contention_title || ''
    const body = section.content || section.conflict_summary || ''
    
    if (title) html += `<h4 class="font-bold text-slate-900 mt-8 mb-4">${title}</h4>`
    if (body) html += `<p class="mb-4">${body}</p>`
    
    if (section.media_views && section.media_views.length > 0) {
      section.media_views.forEach((view: any) => {
        const scheme = mediaColorMap[view.press]
        const hlClass = scheme ? scheme.hl : 'hl-neutral'
        html += `<p class="mb-4 leading-relaxed"><span class="${hlClass}">${view.press || ''}</span> ${view.narrative || ''}</p>`
      })
    }
  });

  // 5. 기사 본문 (article_body) - 백엔드 순서상 가장 마지막에 오는 경우가 많음
  if (draft.article_body) {
    const paragraphs = draft.article_body.split('\n\n').filter((p: string) => p.trim());
    html += paragraphs.map((p: string) => `<p class="mb-5 leading-[1.8] text-slate-700">${p.trim().replace(/\n/g, '<br/>')}</p>`).join('');
  } 

  // 6. 맺음말
  const conclusion = draft.conclusion || draft.summary || ''
  if (conclusion && !html.includes(conclusion.substring(0, 20))) {
    html += `<p class="mt-8 pt-4 border-t border-slate-100 text-slate-500 italic">${conclusion}</p>`
  }

  // 7. 폴백 (데이터 전무할 경우)
  if (!html.trim()) {
    const fallback = draft.description || draft.background || '생성된 초안 내용이 없습니다.';
    html = `<p class="text-slate-400">${fallback}</p>`;
  }

  // XSS 방지를 하되, 우리가 사용하는 특정 클래스와 태그는 허용하도록 설정
  return DOMPurify.sanitize(html, {
    ADD_TAGS: ['span', 'h4', 'div', 'br', 'p'],
    ADD_ATTR: ['class']
  })
}
