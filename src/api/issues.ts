import { DailyIssuesResponse } from '../types/issues';
import { IssueAnalysisResponse, DraftImage, IssueTimelineResponse } from '../types/analysis';
import { apiGet } from './fetchWithTimeout';

/**
 * 실시간 통합 순위 및 차트아웃 이슈 데이터를 가져오는 API 서비스입니다.
 */
export const fetchDailyIssues = () =>
  apiGet<DailyIssuesResponse>('/issues/daily-issues', '이슈 데이터를 불러오는 데 실패했습니다');

/**
 * 특정 이슈의 심층 분석 데이터를 가져오는 API 서비스입니다.
 */
export const fetchIssueAnalysis = (id: string) =>
  apiGet<IssueAnalysisResponse>(`/issues/${id}/analysis`, '분석 데이터를 불러오는 데 실패했습니다');

/**
 * 특정 이슈의 초안 데이터를 가져오는 API 서비스입니다.
 */
export const fetchIssueDraft = (id: string) =>
  apiGet<IssueAnalysisResponse>(`/issues/${id}/draft`, '초안 데이터를 불러오는 데 실패했습니다');

/**
 * 특정 이슈의 관련 뉴스 미디어 이미지를 가져오는 API 서비스입니다.
 */
export const fetchDraftImages = (id: string) =>
  apiGet<DraftImage[]>(`/api/draft/images/${id}`, '이미지 데이터를 불러오는 데 실패했습니다');

/**
 * 특정 이슈의 타임라인 데이터를 가져오는 API 서비스입니다.
 */
export const fetchIssueTimeline = (id: string) =>
  apiGet<IssueTimelineResponse>(`/issues/${id}/timeline`, '타임라인 데이터를 불러오는 데 실패했습니다');
