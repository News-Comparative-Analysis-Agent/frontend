/**
 * API 공통 설정 모듈입니다.
 * 모든 API 파일에서 이 파일을 import하여 Base URL과 타임아웃 설정을 공유합니다.
 */
export const API_BASE_URL =
  (import.meta.env.VITE_API_BASE_URL as string) || 'http://localhost:8000';

export const API_TIMEOUT = 180000 // 180s (로컬 LLM 지연 및 긴 기사 생성 고려)
export const REQUEST_TIMEOUT_MS = API_TIMEOUT;
