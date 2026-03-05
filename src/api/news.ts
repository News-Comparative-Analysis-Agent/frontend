import { NewsArticle } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://209.38.76.211:8000';
const REQUEST_TIMEOUT_MS = 10000; // 10초

/**
 * 전용 뉴스 API 서비스 모듈입니다.
 * 언론사별 인기 뉴스를 가져오는 기능을 담당합니다.
 */
export const fetchTopNewsByPublisher = async (): Promise<Record<string, NewsArticle[]>> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(`${API_BASE_URL}/articles/top-by-publisher`, {
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`뉴스 데이터를 불러오는 데 실패했습니다 (HTTP ${response.status})`);
    }

    return response.json();
  } catch (e) {
    if (e instanceof DOMException && e.name === 'AbortError') {
      throw new Error('서버 응답이 너무 늦어 요청이 취소되었습니다. 잠시 후 다시 시도해주세요.');
    }
    throw e;
  } finally {
    clearTimeout(timeoutId);
  }
};
