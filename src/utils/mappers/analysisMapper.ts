import { IssueAnalysisResponse, PreGeneratedDraft } from '../../types/analysis';
import { AnalysisViewModel, OpinionItem } from '../../types/models/analysis';
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
 * 백엔드 기술 응답(DTO)을 UI용 모델(ViewModel)로 변환하는 매퍼입니다.
 */
export const mapToAnalysisViewModel = (
  analysisRes: IssueAnalysisResponse,
  parsedDraft: PreGeneratedDraft | null,
  sourceArticles: Record<string, any[]>
): AnalysisViewModel => {
  
  // 1. 초안(Draft) 기반으로 의견 목록 생성
  const draftOpinions: OpinionItem[] = parsedDraft?.contentions.flatMap(contention => 
    contention.media_views.map((view, idx) => ({
      media: view.press as any,
      color: getColorKeyByIndex(idx),
      title: view.narrative.split('.')[0] + '.',
      analysisTitle: view.claim,
      description: view.narrative,
      sources: [{ 
        title: view.title || findActualTitle(view.url, view.press, sourceArticles), 
        url: view.url 
      }]
    }))
  ) || [];

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
    uniqueMediaList
  };
};
