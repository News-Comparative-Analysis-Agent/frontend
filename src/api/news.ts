import { NewsArticle } from '../types';
import { apiGet } from './fetchWithTimeout';

/**
 * 전용 뉴스 API 서비스 모듈입니다.
 * 언론사별 인기 뉴스를 가져오는 기능을 담당합니다.
 */
export const fetchTopNewsByPublisher = () =>
  apiGet<Record<string, NewsArticle[]>>('/articles/top-by-publisher', '뉴스 데이터를 불러오는 데 실패했습니다');
