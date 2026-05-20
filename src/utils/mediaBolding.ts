import { buildMediaColorMap } from './mediaColors';

/**
 * 텍스트 내의 언론사 이름을 찾아 색상 하이라이트와 볼드체로 변경하는 유틸리티입니다.
 */
export function applyMediaBolding(text: string, mediaNames: string[]): string {
  if (!text || !mediaNames || mediaNames.length === 0) return text;

  // 1. 미디어 컬러 맵 구축 (동일 미디어에 일관된 하이라이트 색상 매핑)
  const mediaColorMap = buildMediaColorMap(mediaNames);

  // 긴 이름 우선 순위로 정렬 (예: '한겨레21'이 '한겨레'보다 먼저 매칭되도록)
  const sortedMedia = [...mediaNames].sort((a, b) => b.length - a.length);
  
  // 특수 문자 이스케이프 (언론사 이름에 특수문자가 있을 경우 대비)
  const escapedMedia = sortedMedia.map(m => m.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  
  const pattern = new RegExp(`(${escapedMedia.join('|')})`, 'g');
  
  // 매칭 시 각 언론사별 색상 스킴 적용 (bg, text, padding, border 자동 스타일링 적용)
  return text.replace(pattern, (match) => {
    const scheme = mediaColorMap[match];
    if (scheme && scheme.hl) {
      // Tiptap 에디터 및 스타일 시트에 등록된 .hl-xxx 클래스를 적용하여 배경 형광펜 및 글자 색상 하이라이팅을 입힙니다.
      return `<span class="${scheme.hl}">${match}</span>`;
    }
    return `<span class="font-bold text-slate-900">${match}</span>`;
  });
}
