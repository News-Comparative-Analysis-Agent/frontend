/**
 * HTML 문자열에서 태그를 제거하고 순수 텍스트만 추출합니다.
 */
const stripHtml = (html: string): string => {
  return html.replace(/<[^>]*>?/gm, '').trim();
};

/**
 * HTML 본문을 문단(p, h4 등) 단위로 쪼갭니다.
 */
export const splitToBlocks = (html: string): string[] => {
  // 간단하게 </p>, </h4> 태그 뒤를 기준으로 나눕니다.
  // 실제 환경에서는 더 정교한 파서가 필요할 수 있으나, 현재 구조에서는 이 방식이 효율적입니다.
  return html
    .split(/(?<=<\/p>|<\/h4>)/g)
    .filter(block => block.trim().length > 0);
};

/**
 * 여러 문단 중 타겟 텍스트와 가장 유사한 문단의 인덱스를 찾습니다.
 */
export const findBestMatchIndex = (blocks: string[], targetText: string): number => {
  if (blocks.length === 0) return -1;
  const cleanTarget = stripHtml(targetText).toLowerCase();
  
  let bestIndex = 0;
  let highestScore = -1;

  blocks.forEach((block, index) => {
    const cleanBlock = stripHtml(block).toLowerCase();
    
    // 💡 간단한 겹침 점수 (Overlap Score) 계산
    // 두 텍스트 중 더 짧은 것이 긴 것의 일부인지, 혹은 얼마나 많은 단어가 겹치는지 확인
    let score = 0;
    if (cleanBlock.includes(cleanTarget) || cleanTarget.includes(cleanBlock)) {
      score = 100; // 완전 포함 시 높은 점수
    } else {
      // 단어 단위 겹침 확인
      const blockWords = new Set(cleanBlock.split(/\s+/));
      const targetWords = cleanTarget.split(/\s+/);
      const intersection = targetWords.filter(word => blockWords.has(word));
      score = intersection.length;
    }

    if (score > highestScore) {
      highestScore = score;
      bestIndex = index;
    }
  });

  return highestScore > 0 ? bestIndex : -1;
};

/**
 * 인덱스에 해당하는 문단을 새로운 텍스트로 교체하여 전체 HTML을 재구성합니다.
 */
export const getPatchedHtml = (blocks: string[], newText: string, index: number): string => {
  if (index < 0 || index >= blocks.length) return blocks.join('');
  
  const newBlocks = [...blocks];
  // 💡 기존 문단의 태그(p, h4 등)를 유지하기 위해 태그 추출 시도
  const match = blocks[index].match(/^(<[^>]+>)/);
  const tagStart = match ? match[1] : '<p class="mb-4">';
  const tagEnd = tagStart.startsWith('<h4') ? '</h4>' : '</p>';
  
  newBlocks[index] = `${tagStart}${newText}${tagEnd}`;
  return newBlocks.join('');
};

/**
 * 💡 본문에 실수로 박힌 AI 하이라이트(span 태그 등)를 깨끗하게 제거합니다.
 */
export const stripDiffTags = (html: string): string => {
  if (!html) return '';
  
  // 1. 빨간색(삭제 예정) 부분은 아예 제거합니다. (이미 오염되었다면 '수락' 상태로 복구하는 것이 사용자 의도에 가깝습니다)
  let cleanHtml = html.replace(/<span[^>]*bg-red-100[^>]*>.*?<\/span>/g, '');
  
  // 2. 초록색(추가 예정) 부분은 태그만 제거하고 내용은 남깁니다.
  cleanHtml = cleanHtml.replace(/<span[^>]*bg-green-100[^>]*>(.*?)<\/span>/g, '$1');
  
  return cleanHtml;
};
