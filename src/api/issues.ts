import { DailyIssuesResponse } from '../types/issues';
import { IssueAnalysisResponse, DraftImage, IssueTimelineResponse } from '../types/analysis';
import { apiGet } from './fetchWithTimeout';

/**
 * 실시간 통합 순위 및 차트아웃 이슈 데이터를 가져오는 API 서비스입니다.
 */
export const fetchDailyIssues = () =>
  apiGet<DailyIssuesResponse>('/issues/grouped?days=7', '이슈 데이터를 불러오는 데 실패했습니다');

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
 * 특정 이슈의 인용 출처(Citations) 데이터를 가져오는 API 서비스입니다.
 */
export const fetchDraftCitations = (id: string) =>
  apiGet<any>(`/draft/citations/${id}`, '인용 출처 데이터를 불러오는 데 실패했습니다');

/**
 * 인용 마커 클릭 시 기사 원문을 lazy-load하는 API 서비스입니다.
 */
export const fetchArticleBody = (articleId: number) =>
  apiGet<{ article_id: number; raw_content: string }>(`/draft/article-body/${articleId}`, '기사 원문을 불러오는 데 실패했습니다');



/**
 * 특정 이슈의 관련 뉴스 미디어 이미지를 가져오는 API 서비스입니다.
 */
export const fetchDraftImages = (id: string) =>
  apiGet<DraftImage[]>(`/draft/images/${id}`, '이미지 데이터를 불러오는 데 실패했습니다');

/**
 * 특정 이슈의 타임라인 데이터를 가져오는 API 서비스입니다.
 */
export const fetchIssueTimeline = (id: string) =>
  apiGet<IssueTimelineResponse>(`/issues/${id}/timeline`, '타임라인 데이터를 불러오는 데 실패했습니다');
