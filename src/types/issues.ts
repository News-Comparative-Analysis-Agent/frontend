export interface ArticleBasicInfo {
  title: string;
  publisher: string;
}

export interface DailyIssue {
  id: number;
  name: string;
  description: string;
  article_count: number;
  rank: number;
  created_at: string;
  image_urls: string[];
  issue_type: 'politics' | 'editorial';
  articles?: ArticleBasicInfo[];
  // 차트아웃 관련 필드 (선택적)
  is_chart_out?: boolean;
  peak_rank?: number | null;
  chart_out_minutes?: number | null;
}

export interface DailyIssuesResponse {
  data: Record<string, DailyIssue[]>;
}

export interface DailyStats {
  article_count: number;
  issue_count: number;
  publisher_count: number;
  critique_count: number;
  last_updated_at: string;
}
