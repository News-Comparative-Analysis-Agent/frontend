import { apiGet } from './fetchWithTimeout'

export interface FinalReviewScoreDetail {
  score: number
  max_score: number
  detail: string
}

export interface FinalReviewScores {
  fairness: FinalReviewScoreDetail
  faithfulness: FinalReviewScoreDetail
  harmlessness: FinalReviewScoreDetail
  total_score: number
  hate_speech_list: string[]
  distortions_count: number
}

export interface FinalReviewResponse {
  id: number
  name: string
  description: string
  background: string
  core_contentions: string
  created_at: string
  updated_at: string
  pre_generated_draft?: string
  sources?: FinalReviewSource[]
  scores: FinalReviewScores
  ai_opinion: string
}

export interface FinalReviewSource {
  title: string
  publisher: string
  url: string
  published_at?: string
}

export interface PreGeneratedDraft {
  issue_id: number
  title?: string
  article_body?: string
}

export const fetchFinalReview = (issueId: number) =>
  apiGet<FinalReviewResponse>(`/api/draft/final-review/${issueId}`, '최종 검토 데이터 조회 실패')

export const parsePreGeneratedDraft = (raw?: string): PreGeneratedDraft | null => {
  if (!raw) return null
  try {
    return JSON.parse(raw) as PreGeneratedDraft
  } catch {
    return null
  }
}
