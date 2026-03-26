/**
 * 초안 작성 API 서비스 모듈입니다.
 * AI 초안 생성, 임시 저장 및 불러오기 기능을 담당합니다.
 *
 * TODO: 백엔드 API 명세 확정 후 실제 엔드포인트와 연동 필요
 */

import { apiGet, apiPost } from './fetchWithTimeout';

export interface DraftGenerateRequest {
  issue_id: number;
  style: 'neutral' | 'analytical' | 'summary';
}

export interface DraftGenerateResponse {
  title: string;
  content: string;
  generated_at: string;
}

export interface SavedDraft {
  id: number;
  title: string;
  content: string;
  issue_id: number;
  last_saved: string;
}

export interface ChatRequest {
  message: string;
  current_content: string;
  issue_id: number;
}

export interface ChatResponse {
  response: string;
  modified_content?: string;
}

/**
 * AI를 이용해 기사 초안을 생성합니다.
 */
export const generateDraft = (request: DraftGenerateRequest) =>
  apiPost<DraftGenerateResponse>('/drafts/generate', request, '초안 생성 실패');

/**
 * 작성 중인 초안을 임시 저장합니다.
 */
export const saveDraft = (draft: Omit<SavedDraft, 'id' | 'last_saved'>) =>
  apiPost<SavedDraft>('/drafts', draft, '임시 저장 실패');

/**
 * 내 임시 저장 초안 목록을 불러옵니다.
 */
export const fetchMyDrafts = () =>
  apiGet<SavedDraft[]>('/drafts/me', '초안 목록 조회 실패');

/**
 * AI 챗봇과 대화합니다.
 */
export const chatWithAI = (request: ChatRequest) =>
  apiPost<ChatResponse>('/api/draft/chat', request, '챗봇 응답 실패');
