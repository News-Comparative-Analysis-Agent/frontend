/**
 * 심층 분석 데이터를 위한 프론트엔드 도메인 모델입니다.
 * 백엔드 DTO(Data Transfer Object)와 UI 레이어를 분리하는 역할을 합니다.
 */

export interface SourceLink {
  title: string;
  url: string;
}

export interface OpinionItem {
  media: string;
  color: 'indigo' | 'violet' | 'emerald' | 'cyan' | 'slate';
  title: string;
  analysisTitle: string;
  description: string;
  sources: SourceLink[];
}

export interface AnalysisViewModel {
  id: number;
  name: string;
  description: string;
  background?: string;
  coreContentions?: string;
  mediaRatio: any | null;
  opinions: OpinionItem[];
  uniqueMediaList: string[];
}
