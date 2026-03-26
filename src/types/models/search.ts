export interface NlpSearchArticle {
  id: string;
  title: string;
  source: string;
  description: string;
  link: string;
  pubDate: string;
  relevance_score: number;
  matching_keywords: string[];
}

export interface NlpSearchData {
  original_query: string;
  generated_keywords: string[];
  ai_summary: string;
  total_results: number;
  articles: NlpSearchArticle[];
  by_source: Record<string, number>;
}

export interface NlpSearchResponse {
  success: boolean;
  data: NlpSearchData;
  message: string | null;
}
