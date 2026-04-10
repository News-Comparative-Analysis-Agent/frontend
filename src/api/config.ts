/**
 * API 공통 설정 모듈입니다.
 * 모든 API 파일에서 이 파일을 import하여 Base URL과 타임아웃 설정을 공유합니다.
 */
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? 'http://68.183.177.114:8000';

export const REQUEST_TIMEOUT_MS = 10_000; // 10초
