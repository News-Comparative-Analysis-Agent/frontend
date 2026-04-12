import { API_BASE_URL } from './config';
import { NlpSearchResponse, NlpSearchArticle } from '../types/models/search';

/**
 * 자연어 검색 (NLP Search) API 호출 함수입니다.
 * 백엔드 변경으로 /articles/search 를 사용하고 결과를 NlpSearch 형태에 맞게 조정합니다.
 * @param query 사용자가 입력한 검색어
 */
export const postNlpSearch = async (query: string): Promise<NlpSearchResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/articles/search?query=${encodeURIComponent(query)}`, {
      method: 'GET'
    });

    if (!response.ok) {
      throw new Error(`자연어 검색 실패 (HTTP ${response.status})`);
    }

    const data = await response.json();
    
    // 매핑 (새로운 API 응답을 NlpSearchArticle 형식으로)
    const mappedArticles: NlpSearchArticle[] = (Array.isArray(data) ? data : []).map((item: any, index: number) => ({
      id: String(item.id || `article_${index}`),
      title: item.title || '',
      source: item.publisher_name || '언론사',
      description: item.title || '', // 백엔드 응답에 요약이 없으면 제목 사용
      link: item.url || '',
      pubDate: item.published_at || new Date().toISOString(),
      relevance_score: 95,
      matching_keywords: [query]
    }));

    // AI 요약 Mocking (최소한의 가이드 구조 제공)
    const aiSummaryStructured = {
      intro: `'${query}' 관련 최신 뉴스를 종합 분석한 결과입니다. 핵심 주제들을 중심으로 관련 기사들이 보도되고 있습니다.`,
      topics: [
        {
          id: 1,
          title: `주요 동향 및 쟁점`,
          content: `언론들은 '${query}'와 관련된 상황을 다양하게 보도하고 있습니다. 각 언론사의 보도 방식을 심층적으로 비교해 보세요.`,
          related_articles: mappedArticles.slice(0, 3).map(a => a.id)
        },
        {
          id: 2,
          title: `후속 조치 및 전망`,
          content: `관련 기관의 입장 및 대응, 그리고 이번 사안에 대한 장기적인 분석이 이어지고 있습니다.`,
          related_articles: mappedArticles.slice(3, 5).map(a => a.id)
        }
      ]
    };

    return {
      success: true,
      message: null,
      data: {
        original_query: query,
        generated_keywords: [query, '동향', '분석'],
        ai_summary: '',
        ai_summary_structured: aiSummaryStructured,
        total_results: mappedArticles.length,
        articles: mappedArticles,
        by_source: {}
      }
    };
  } catch (err) {
    console.error('NLP Search Error:', err);
    throw new Error('자연어 검색에 실패했습니다.');
  }
};
