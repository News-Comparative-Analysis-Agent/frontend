/**
 * 초안 작성 API 서비스 모듈입니다.
 * AI 초안 생성, 임시 저장 및 불러오기 기능을 담당합니다.
 * 
 * TODO: 백엔드 API 명세 확정 후 실제 엔드포인트와 연동 필요
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api';

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

/**
 * AI를 이용해 기사 초안을 생성합니다.
 * @param request - 이슈 ID와 작성 스타일
 */
export const generateDraft = async (request: DraftGenerateRequest): Promise<DraftGenerateResponse> => {
  const response = await fetch(`${API_BASE_URL}/drafts/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });
  if (!response.ok) throw new Error(`초안 생성 실패 (HTTP ${response.status})`);
  return response.json();
};

/**
 * 작성 중인 초안을 임시 저장합니다.
 * @param draft - 저장할 초안 데이터
 */
export const saveDraft = async (draft: Omit<SavedDraft, 'id' | 'last_saved'>): Promise<SavedDraft> => {
  const response = await fetch(`${API_BASE_URL}/drafts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(draft),
  });
  if (!response.ok) throw new Error(`임시 저장 실패 (HTTP ${response.status})`);
  return response.json();
};

/**
 * 내 임시 저장 초안 목록을 불러옵니다.
 */
export const fetchMyDrafts = async (): Promise<SavedDraft[]> => {
  const response = await fetch(`${API_BASE_URL}/drafts/me`);
  if (!response.ok) throw new Error(`초안 목록 조회 실패 (HTTP ${response.status})`);
  return response.json();
};

export interface ChatRequest {
  message: string;
  current_content: string;
}

export interface ChatResponse {
  response: string;
  modified_content?: string;
}

/**
 * AI 챗봇과 대화합니다.
 * @param request - 사용자 메시지 및 현재 에디터 본문
 */
export const chatWithAI = async (request: ChatRequest): Promise<ChatResponse> => {
  const response = await fetch(`http://209.38.76.211:8000/api/draft/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });
  if (!response.ok) throw new Error(`챗봇 응답 실패 (HTTP ${response.status})`);
  return response.json();
};
