import DOMPurify from 'dompurify'
import { PreGeneratedDraft } from '../types/analysis'

interface MediaColorScheme {
  hl: string
  [key: string]: string
}

/**
 * PreGeneratedDraft 데이터를 안전한 HTML 문자열로 변환합니다.
 * XSS 방지를 위해 DOMPurify로 sanitize 처리합니다.
 */
export const buildDraftHtml = (
  draft: PreGeneratedDraft,
  mediaColorMap: Record<string, MediaColorScheme>
): string => {
  let html = `<p class="mb-4">${draft.introduction || ''}</p>`

  draft.contentions?.forEach(contention => {
    html += `<h4 class="font-bold text-slate-900 mt-8 mb-4">${contention.contention_title || ''}</h4>`
    html += `<p class="mb-4">${contention.conflict_summary || ''}</p>`

    contention.media_views?.forEach(view => {
      const scheme = mediaColorMap[view.press]
      const hlClass = scheme ? scheme.hl : 'hl-neutral'
      html += `<p class="mb-3"><span class="${hlClass}">${view.press || ''}</span>은(는) "${view.claim || ''}"라고 주장하며, "${view.narrative || ''}"라고 전했습니다.</p>`
    })
  })

  html += `<p class="mt-8 pt-4 border-t border-slate-100">${draft.summary || ''}</p>`

  return DOMPurify.sanitize(html)
}
