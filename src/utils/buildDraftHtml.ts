import DOMPurify from 'dompurify'
import { applyMediaBolding } from './mediaBolding'

interface MediaColorScheme {
  hl: string
  [key: string]: string
}

/**
 * 텍스트 내의 [1], [2] 마커를 스타일링된 span 태그로 변환합니다.
 */
export const applyCitationMarkers = (content: string): string => {
  if (!content) return '';
  return content.replace(/\[(\d+)\]/g, '<span class="citation-marker" data-id="$1">[$1]</span>');
};

/**
 * 평문 텍스트를 마커와 줄바꿈이 적용된 안전한 HTML로 변환합니다.
 * @param content 원본 텍스트
 * @param mediaNames 볼드 처리할 언론사 이름 목록
 */
export const sanitizeDraftHtml = (content: string, mediaNames: string[] = []): string => {
  if (!content) return '';
  
  // 1. 언론사 이름 볼드 처리
  let html = applyMediaBolding(content, mediaNames);
  
  // 2. 인용 마커 스타일링
  html = applyCitationMarkers(html);
  
  // 3. 줄바꿈(\n) 처리:
  // 본문에 블록 태그(p, div, h4 등)가 이미 정교하게 구성되어 있다면 개행을 br로 바꿉니다.
  // 그렇지 않다면 일반적인 평문 형태이므로, \n\n을 기준으로 문단을 나누어 <p> 태그로 묶어주고 문단 내 \n은 <br/>로 만듭니다.
  const hasBlockTags = /<(p|div|h\d|section|article)[^>]*>/i.test(html);
  let finalHtml: string;

  if (hasBlockTags) {
    finalHtml = html.replace(/\n/g, '<br />');
  } else {
    // 먼저 모든 \r\n을 \n으로 통일하고, 모든 \n을 <br />로 변환하여 하나의 p 태그로 묶습니다.
    const normalized = html.replace(/\r\n/g, '\n');
    const lineWithBrs = normalized.replace(/\n/g, '<br />');
    finalHtml = `<p>${lineWithBrs}</p>`;
  }

  const sanitize = (DOMPurify.sanitize || (DOMPurify as any).default?.sanitize);

  return sanitize(finalHtml, {
    ADD_TAGS: ['span', 'h4', 'div', 'br', 'p', 'img', 'button'],
    ADD_ATTR: ['class', 'data-id', 'src', 'alt', 'data-editor-image-id', 'contenteditable', 'draggable', 'style', 'title']
  });
};

/**
 * 백엔드 데이터 순서를 최대한 존중하여 초안 HTML을 생성합니다.
 */
export const buildDraftHtml = (
  draft: any,
  mediaColorMap: Record<string, MediaColorScheme>
): string => {
  const mediaNames = Object.keys(mediaColorMap);

  // 0. 단순 문자열인 경우 처리 (신규 포맷 대응)
  if (typeof draft === 'string') {
    return sanitizeDraftHtml(draft, mediaNames);
  }

  let html = ''
  
  // 1. 도입부 (있을 경우만)
  const intro = draft.intro || draft.introduction || ''
  if (intro) {
    html += `<p>${intro}</p>`;
  }

  // 2. 언론사 공방 요약 (있을 경우만)
  if (draft.conflict_summary) {
    html += `<p>${draft.conflict_summary}</p>`;
  }

  // 3. 언론사별 개별 입장 (media_views)
  const rootMediaViews = draft.media_views || [];
  if (rootMediaViews.length > 0) {
    rootMediaViews.forEach((view: any) => {
      html += `<p><strong>${view.press || ''}</strong> ${view.narrative || ''}</p>`
    });
  }

  // 4. 계층형 섹션 (sections/contentions)
  const sections = draft.sections || draft.contentions || []
  sections.forEach((section: any) => {
    const title = section.section_title || section.contention_title || ''
    const body = section.content || section.conflict_summary || ''
    
    if (title) html += `<h4>${title}</h4>`
    if (body) html += `<p>${body}</p>`
    
    if (section.media_views && section.media_views.length > 0) {
      section.media_views.forEach((view: any) => {
        html += `<p><strong>${view.press || ''}</strong> ${view.narrative || ''}</p>`
      })
    }
  });

  // 5. 기사 본문 (article_body)
  if (draft.article_body) {
    html += sanitizeDraftHtml(draft.article_body, mediaNames);
  }

  return html;
};
