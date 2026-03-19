import { API_BASE_URL, REQUEST_TIMEOUT_MS } from './config';

/**
 * 타임아웃과 에러 처리가 내장된 공통 fetch 헬퍼입니다.
 * 모든 GET/POST API 호출에서 이 함수를 사용하여 보일러플레이트를 제거합니다.
 *
 * @param url      - 요청할 전체 URL (BASE URL 포함)
 * @param label    - 에러 메시지에 사용할 한글 라벨 (예: '분석 데이터 로드 실패')
 * @param options  - fetch에 전달할 추가 옵션 (method, headers, body 등)
 */
export async function fetchWithTimeout<T>(
  url: string,
  label: string,
  options?: RequestInit
): Promise<T> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`${label} (HTTP ${response.status})`);
    }

    return response.json();
  } catch (e) {
    if (e instanceof DOMException && e.name === 'AbortError') {
      throw new Error(
        '서버 응답이 지연되어 요청이 취소되었습니다. 잠시 후 다시 시도해 주세요.'
      );
    }
    throw e;
  } finally {
    clearTimeout(timeoutId);
  }
}

// ── 편의 래퍼 ─────────────────────────────────────────

/** GET 요청 헬퍼 */
export function apiGet<T>(path: string, label: string): Promise<T> {
  return fetchWithTimeout<T>(`${API_BASE_URL}${path}`, label);
}

/** POST 요청 헬퍼 */
export function apiPost<T>(
  path: string,
  body: unknown,
  label: string
): Promise<T> {
  return fetchWithTimeout<T>(`${API_BASE_URL}${path}`, label, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}
