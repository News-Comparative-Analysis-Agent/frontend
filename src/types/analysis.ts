export interface MediaView {
  press: string;
  claim: string;
  evidence: string;
  url: string;
  argument_summary: string;
  narrative: string;
}

export interface Contention {
  contention_title: string;
  conflict_summary: string;
  media_views: MediaView[];
}

export interface PreGeneratedDraft {
  title: string;
  introduction: string;
  contentions: Contention[];
  summary: string;
  edit_log: string;
}

export interface ClaimCard {
  id: number;
  press: string;
  claim: string;
  evidence: string;
  url: string;
}

export interface IssueAnalysisResponse {
  id: number;
  name: string;
  description: string;
  background: string;
  core_contentions: string;
  media_ratio: null | any;
  pre_generated_draft: string; // JSON String
  created_at: string;
  claim_cards: ClaimCard[];
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
