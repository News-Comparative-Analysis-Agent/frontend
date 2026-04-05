import { diffWords } from 'diff';

/**
 * 두 텍스트를 비교하여 차이점을 배열로 반환합니다.
 * - added: true (새로 추가된 내용 - 초록색 표시용)
 * - removed: true (기존에서 삭제된 내용 - 빨간색 취소선용)
 * - 둘 다 false: 변경 없는 공통 내용
 */
export const generateDiff = (original: string, modified: string) => {
  if (!original) return [{ value: modified, added: true, removed: false }];
  if (!modified) return [{ value: original, added: false, removed: true }];

  const diff = diffWords(original, modified);

  return diff.map(part => ({
    value: part.value,
    added: !!part.added,
    removed: !!part.removed
  }));
};
