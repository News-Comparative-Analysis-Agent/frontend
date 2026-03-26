/**
 * 심층 분석 API 서비스 모듈입니다.
 * 이슈 배경 정보, 타임라인, 언론사별 논조 분석을 담당합니다.
 * 
 * TODO: 백엔드 API 명세 확정 후 실제 엔드포인트와 연동 필요
 */

import { API_BASE_URL } from './config';

export interface IssueBackground {
  summary: string;
  timeline: { date: string; event: string }[];
  distribution: { conservative: number; progressive: number; neutral: number };
}

export interface OpinionAnalysis {
  id: number;
  publisher_name: string;
  stance: 'progressive' | 'neutral' | 'conservative';
  title: string;
  analysis_title: string;
  description: string;
  source_articles: { id: number; title: string; url: string }[];
}

/**
 * 이슈 ID로 배경 정보 및 타임라인을 조회합니다.
 * @param issueId - 이슈 고유 ID
 */
export const fetchIssueBackground = async (issueId: number): Promise<IssueBackground> => {
  const response = await fetch(`${API_BASE_URL}/issues/${issueId}/background`);
  if (!response.ok) throw new Error(`이슈 배경 조회 실패 (HTTP ${response.status})`);
  return response.json();
};

/**
 * 이슈 ID로 언론사별 논조 분석 목록을 조회합니다.
 * @param issueId - 이슈 고유 ID
 * @param stance - 논조 필터: 'all' | 'progressive' | 'neutral' | 'conservative'
 */
export const fetchOpinionAnalysis = async (issueId: number, stance = 'all'): Promise<OpinionAnalysis[]> => {
  const params = new URLSearchParams({ stance });
  const response = await fetch(`${API_BASE_URL}/issues/${issueId}/opinions?${params}`);
  if (!response.ok) throw new Error(`논조 분석 조회 실패 (HTTP ${response.status})`);
  return response.json();
};
