export interface DailyIssue {
  id: number;
  name: string;
  description: string;
  article_count: number;
  rank: number;
  created_at: string;
  image_urls: string[];
  is_chart_out: boolean;
  peak_rank: number | null;
  chart_out_minutes: number | null;
}

export interface DailyIssuesResponse {
  top_issues: DailyIssue[];
  chart_out_issues: DailyIssue[];
}
