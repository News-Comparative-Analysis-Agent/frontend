/**
 * Date 객체를 'YYYY-MM-DD' 형식의 문자열로 변환합니다.
 * 프로젝트 전역에서 날짜 키를 생성할 때 사용하는 단일 공급원(SSOT) 함수입니다.
 *
 * @example
 * toDateKey(new Date('2026-05-15')) // '2026-05-15'
 */
export const toDateKey = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};
