import { apiPost } from './fetchWithTimeout';
import { NlpSearchResponse, NlpSearchArticle } from '../types/models/search';

/**
 * 자연어 검색 (NLP Search) API 호출 함수입니다.
 * POST /scroller/nlp 엔드포인트를 호출하여 기사 및 연관 이슈 데이터를 연동합니다.
 * @param query 사용자가 입력한 검색어
 */
export const postNlpSearch = async (query: string): Promise<NlpSearchResponse> => {
  const rawResponse = await apiPost<any>('/scroller/nlp', { query }, '자연어 검색 실패');

  if (rawResponse.success && rawResponse.data) {
    // 혹시 모를 기사 ID 타입 오류(number -> string) 방지를 위해 문자열로 매핑
    const mappedArticles: NlpSearchArticle[] = (rawResponse.data.articles || []).map((item: any) => ({
      id: String(item.id),
      title: item.title || '',
      source: item.source || item.publisher_name || '언론사',
      description: item.description || item.title || '',
      link: item.link || item.url || '',
      pubDate: item.pubDate || item.published_at || new Date().toISOString(),
      relevance_score: typeof item.relevance_score === 'number' ? item.relevance_score : 95,
      matching_keywords: item.matching_keywords || [query]
    }));

    // topics의 related_articles 매핑 (만약 number 타입으로 되어있다면 string으로 변환)
    let mappedStructured = rawResponse.data.ai_summary_structured;
    if (mappedStructured && Array.isArray(mappedStructured.topics)) {
      mappedStructured = {
        ...mappedStructured,
        topics: mappedStructured.topics.map((topic: any) => ({
          ...topic,
          related_articles: (topic.related_articles || []).map((id: any) => String(id))
        }))
      };
    }

    return {
      success: true,
      message: rawResponse.message || null,
      data: {
        ...rawResponse.data,
        articles: mappedArticles,
        ai_summary_structured: mappedStructured
      }
    };
  }

  return rawResponse;
};
