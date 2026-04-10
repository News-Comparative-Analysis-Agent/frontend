export interface MediaView {
  press: string;
  claim: string;
  evidence: string;
  url: string;
  argument_summary: string;
  narrative: string;
  title?: string;
}

export interface Contention {
  contention_title: string;
  conflict_summary: string;
  media_views: MediaView[];
}

export interface Section {
  section_title: string;
  content: string;
  media_views: MediaView[];
}

export interface PreGeneratedDraft {
  title: string;
  introduction?: string;
  intro?: string;
  contentions?: Contention[];
  sections?: Section[];
  summary?: string;
  conclusion?: string;
  edit_log?: string;
  
  // 평면 구조(Flat Structure) 대응 필드 추가
  article_body?: string;
  description?: string;
  background?: string;
  core_contentions?: string;
  conflict_summary?: string;
  media_views?: MediaView[];
}

export interface ClaimCard {
  id: number;
  press: string;
  claim: string;
  evidence: string;
  url: string;
  title?: string;
}

export interface IssueAnalysisResponse {
  id: number;
  name: string;
  description: string;
  background: string;
  core_contentions: string;
  media_ratio?: null | any;
  pre_generated_draft: string | any; // JSON String 또는 Plain Text
  created_at: string;
  claim_cards: ClaimCard[];
  image_urls?: string[];
}

/** 초안 작성 페이지 좌측 사이드바의 인용구 카드에 사용되는 타입입니다. */
export interface SidebarQuote {
  id: number;
  media: string;
  bg: string;
  textColor: string;
  borderColor: string;
  text: string;
  evidence: string;
  links: string[];
}

/** 초안 작성 페이지 하단 관련 뉴스 미디어 이미지 정보에 사용되는 타입입니다. */
export interface DraftImage {
  url: string;
  title: string;
  publisher: string;
  published_at: string;
}

/** 자연어 검색 결과 - 주제별 요약 정보 */
export interface Topic {
  id: number;
  title: string;
  content: string;
  related_articles: string[]; // 뉴스 ID 리스트
}

export interface AISummaryStructured {
  intro: string;
  topics: Topic[];
}

/** 자연어 검색 결과 내 뉴스 기사 정보 */
export interface SearchArticle {
  id: string;
  title: string;
  source: string;
  description: string;
  link: string;
  pubDate: string;
  relevance_score: number;
  matching_keywords: string[];
}

/** 자연어 검색 최종 응답 형식 */
export interface SearchAnalysisResponse {
  original_query: string;
  generated_keywords: string[];
  ai_summary: string;
  ai_summary_structured: AISummaryStructured;
  total_results: number;
  articles: SearchArticle[];
  by_source: Record<string, number>;
}

/** 타임라인 이벤트를 위한 백엔드 응답 타입 */
export interface TimelineEvent {
  id: number;
  name: string;
  article_count: number;
  created_at: string;
  image_urls: string[];
}

export interface IssueTimelineResponse {
  target_issue_id: number;
  target_issue_name: string;
  timeline: TimelineEvent[];
}
