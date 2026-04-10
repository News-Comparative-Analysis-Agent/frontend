/**
 * 텍스트 내의 언론사 이름을 찾아 볼드체로 변경하는 유틸리티입니다.
 */
export function applyMediaBolding(text: string, mediaNames: string[]): string {
  if (!text || !mediaNames || mediaNames.length === 0) return text;

  // 긴 이름 우선 순위로 정렬 (예: '한겨레21'이 '한겨레'보다 먼저 매칭되도록)
  const sortedMedia = [...mediaNames].sort((a, b) => b.length - a.length);
  
  // 특수 문자 이스케이프 (언론사 이름에 특수문자가 있을 경우 대비)
  const escapedMedia = sortedMedia.map(m => m.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  
  const pattern = new RegExp(`(${escapedMedia.join('|')})`, 'g');
  
  // 이미 볼드 처리가 되어있는 경우 중복 처리 방지를 위해 체크 로직이 필요할 수 있지만,
  // 단순 replace로 처리하되 HTML 태그 내부의 텍스트만 건드릴 수 있도록 주의가 필요함.
  // 여기서는 일단 단순 문자열로 들어오는 경우를 처리함.
  return text.replace(pattern, '<span class="font-bold text-slate-900">$1</span>');
}
