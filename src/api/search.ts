/**
 * 검색 API 서비스 모듈입니다.
 * 이슈 검색 및 개별 기사 목록 조회 기능을 담당합니다.
 * 
 * TODO: 백엔드 API 명세 확정 후 실제 엔드포인트와 연동 필요
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api';

export interface SearchIssueResult {
  id: number;
  title: string;
  description: string;
  points: string[];
  coverage: number;
}

export interface SearchArticleResult {
  id: number;
  title: string;
  publisher_name: string;
  published_at: string;
  url: string;
}

/**
 * 키워드로 관련 이슈를 검색합니다.
 * @param query - 검색 키워드
 */
export const searchIssues = async (query: string): Promise<SearchIssueResult[]> => {
  const response = await fetch(`${API_BASE_URL}/issues/search?q=${encodeURIComponent(query)}`);
  if (!response.ok) throw new Error(`검색 실패 (HTTP ${response.status})`);
  return response.json();
};

/**
 * 키워드로 관련 기사 목록을 검색합니다.
 * @param query - 검색 키워드
 * @param publisher - 언론사 필터 (선택)
 */
export const searchArticles = async (query: string, publisher?: string): Promise<SearchArticleResult[]> => {
  const params = new URLSearchParams({ q: query });
  if (publisher) params.append('publisher', publisher);
  const response = await fetch(`${API_BASE_URL}/articles/search?${params}`);
  if (!response.ok) throw new Error(`기사 검색 실패 (HTTP ${response.status})`);
  return response.json();
};
