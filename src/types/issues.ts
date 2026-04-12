export interface DailyIssue {
  id: number;
  name: string;
  description: string;
  article_count: number;
  rank: number;
  created_at: string;
  image_urls: string[];
  // 차트아웃 관련 필드 (선택적)
  is_chart_out?: boolean;
  peak_rank?: number | null;
  chart_out_minutes?: number | null;
}

export interface DailyIssuesResponse {
  data: Record<string, DailyIssue[]>;
}
