import { API_BASE_URL } from './config';
import { NlpSearchResponse } from '../types/models/search';

/**
 * 자연어 검색 (NLP Search) API 호출 함수입니다.
 * @param query 사용자가 입력한 검색어
 */
export const postNlpSearch = async (query: string): Promise<NlpSearchResponse> => {
  const response = await fetch(`${API_BASE_URL}/scroller/nlp`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query }),
  });

  if (!response.ok) {
    throw new Error(`자연어 검색 실패 (HTTP ${response.status})`);
  }

  return response.json();
};
