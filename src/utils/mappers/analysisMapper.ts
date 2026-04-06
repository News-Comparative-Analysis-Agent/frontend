import { IssueAnalysisResponse, PreGeneratedDraft, IssueTimelineResponse } from '../../types/analysis';
import { AnalysisViewModel, OpinionItem, TimelineItem } from '../../types/models/analysis';
import { getColorKeyByIndex } from '../mediaColors';

/**
 * URL과 언론사명을 기반으로 실제 기사 제목을 찾는 헬퍼 함수
 */
const findActualTitle = (
  url: string, 
  press: string, 
  sourceArticles: Record<string, any[]>
): string => {
  const mediaNews = sourceArticles[press] || [];
  const found = mediaNews.find((a: any) => a.url === url);
  if (found) return found.title;

  const allArticles = Object.values(sourceArticles).flat();
  const foundGlobal = allArticles.find((a: any) => a.url === url);
  if (foundGlobal) return foundGlobal.title;

  return `${press} 원문 기사`;
};

/**
 * 백엔드 타임라인 데이터를 UI용 모델로 변환합니다.
 */
const mapTimeline = (
  timelineData: IssueTimelineResponse | null,
  currentIssueId: number,
  fallbackName: string,
  fallbackDate: string
): TimelineItem[] => {
  if (!timelineData || !timelineData.timeline || timelineData.timeline.length === 0) {
    const dateObj = new Date(fallbackDate);
    const month = dateObj.getMonth() + 1;
    const day = dateObj.getDate();
    return [{ 
      date: `${month}.${day}`, 
      content: fallbackName,
      isCurrent: true 
    }];
  }

  return timelineData.timeline.map(event => {
    const dateObj = new Date(event.created_at);
    const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
    const day = dateObj.getDate().toString().padStart(2, '0');
    
    return {
      date: `${month}.${day}`,
      content: event.name,
      isCurrent: event.id === currentIssueId
    };
  });
};

/**
 * 백엔드 기술 응답(DTO)을 UI용 모델(ViewModel)로 변환하는 매퍼입니다.
 */
export const mapToAnalysisViewModel = (
  analysisRes: IssueAnalysisResponse,
  parsedDraft: PreGeneratedDraft | null,
  sourceArticles: Record<string, any[]>,
  timelineData?: IssueTimelineResponse | null
): AnalysisViewModel => {
  
  // 1. 초안(Draft) 기반으로 의견 목록 생성
  const draftMediaViews = parsedDraft?.media_views || (parsedDraft?.sections || parsedDraft?.contentions || []).flatMap(s => s.media_views || []);
  
  const draftOpinions: OpinionItem[] = draftMediaViews.map((view: any, idx: number) => ({
    media: view.press as any,
    color: getColorKeyByIndex(idx),
    title: (view.narrative || '').split('.')[0] + '.',
    analysisTitle: view.claim || "보도 내용",
    description: view.narrative || "",
    sources: [{ 
      title: view.title || findActualTitle(view.url || '', view.press || '', sourceArticles), 
      url: view.url || ''
    }]
  }));

  // 2. 클레임 카드 기반으로 의견 목록 생성 (초안 없을 시 대비)
  const cardOpinions: OpinionItem[] = (analysisRes.claim_cards ?? []).map((card, idx) => ({
    media: card.press as any,
    color: getColorKeyByIndex(idx),
    title: card.claim,
    analysisTitle: "보도 내용 및 주장",
    description: card.evidence,
    sources: [{ 
      title: card.title || findActualTitle(card.url, card.press, sourceArticles), 
      url: card.url 
    }]
  }));

  // 우선순위에 따른 최종 리스트
  const opinions = draftOpinions.length > 0 ? draftOpinions : cardOpinions;
  
  // 유니크한 언론사 목록
  const uniqueMediaList = Array.from(new Set(opinions.map(o => o.media)));

  return {
    id: analysisRes.id,
    name: analysisRes.name,
    description: analysisRes.description,
    background: analysisRes.background,
    coreContentions: analysisRes.core_contentions,
    mediaRatio: analysisRes.media_ratio,
    opinions,
    uniqueMediaList,
    timeline: mapTimeline(timelineData || null, analysisRes.id, analysisRes.name, analysisRes.created_at)
  };
};
