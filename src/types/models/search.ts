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

export interface NlpSearchTopic {
  id: number;
  title: string;
  content: string;
  related_articles: string[];
}

export interface NlpSearchStructured {
  intro: string;
  topics: NlpSearchTopic[];
}

export interface NlpSearchData {
  original_query: string;
  generated_keywords: string[];
  ai_summary: string;
  ai_summary_structured?: NlpSearchStructured;
  total_results: number;
  articles: NlpSearchArticle[];
  by_source: Record<string, number>;
}

export interface NlpSearchResponse {
  success: boolean;
  data: NlpSearchData;
  message: string | null;
}
