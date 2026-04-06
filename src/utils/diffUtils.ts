import { diffWordsWithSpace } from 'diff';

export interface DiffPart {
  type: 'added' | 'removed' | 'unchanged';
  value: string;
}

/**
 * HTML 태그를 제거하고 특수 기호(&nbsp; 등)를 일반 공백으로 치환하여 순수 텍스트만 추출합니다.
 */
const stripHtml = (html: string) => {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  const text = doc.body.textContent || "";
  // &nbsp; 를 일반 공백으로 치환하고 중복 공백 정제
  return text.replace(/\u00a0/g, " ").replace(/\s+/g, " ").trim();
};

/**
 * 두 문자열을 비교하여 변경된 부분과 문맥을 추출합니다.
 */
export const getDiffWithContext = (oldStr: string, newStr: string, contextSize: number = 5): DiffPart[] => {
  // 1. 비교 전 HTML 태그 제거 및 정규화
  const cleanOld = stripHtml(oldStr);
  const cleanNew = stripHtml(newStr);
  
  // 💡 단어 단위 비교 실행
  const diffs = diffWordsWithSpace(cleanOld, cleanNew);
  
  const result: DiffPart[] = [];
  const totalParts = diffs.length;
  
  // 2. 실제 의미 있는 변경이 일어난 인덱스 찾기 (단순 공백 변경 제외)
  const changeIndices = diffs.map((d, i) => {
    if ((d.added || d.removed) && d.value.trim().length > 0) return i;
    return -1;
  }).filter(i => i !== -1);
  
  if (changeIndices.length === 0) {
    return [{ type: 'unchanged', value: '본문의 시각적인 변화가 없습니다.' }];
  }

  // 3. 가시성 마킹 (변경 지점 주변 단어들)
  const visibleFlags = new Array(totalParts).fill(false);
  
  changeIndices.forEach(idx => {
    // 변경점 앞뒤로 contextSize 만큼만 노출
    const start = Math.max(0, idx - contextSize);
    const end = Math.min(totalParts - 1, idx + contextSize);
    for (let i = start; i <= end; i++) {
        visibleFlags[i] = true;
    }
  });

  // 4. 마킹된 부분만 추출하고, 끊긴 곳은 '...' 추가
  let lastWasEllipsis = false;

  diffs.forEach((part, i) => {
    const type = part.added ? 'added' : part.removed ? 'removed' : 'unchanged';
    
    if (visibleFlags[i]) {
      result.push({ type, value: part.value });
      lastWasEllipsis = false;
    } else {
      // 💡 생략 구간: 이미 생략 표시('...')가 들어갔다면 건너뜀
      if (!lastWasEllipsis) {
        result.push({ type: 'unchanged', value: ' ... ' });
        lastWasEllipsis = true;
      }
    }
  });

  return result;
};

/**
 * 기사 전체 본문에 대해 삭제/추가 사항을 하이라이트 태그로 감싼 HTML을 생성합니다.
 * (본문 프리뷰 모드 전용)
 */
export const generateFullDiffHtml = (oldStr: string, newStr: string): string => {
  const cleanOld = stripHtml(oldStr);
  const cleanNew = stripHtml(newStr);
  const diffs = diffWordsWithSpace(cleanOld, cleanNew);

  return diffs.map(part => {
    if (part.added) {
      return `<span class="bg-emerald-100 text-slate-900 px-1 rounded mx-0.5 transition-all duration-500">${part.value}</span>`;
    }
    if (part.removed) {
      return `<span class="bg-rose-100 text-slate-900 px-1 rounded mx-0.5 transition-all opacity-90">${part.value}</span>`;
    }
    return part.value;
  }).join('');
};
