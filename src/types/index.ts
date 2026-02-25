export interface Article {
  id: number;
  title: string;
  rank: number;
  image?: string;
}

export interface MediaGroup {
  category: string;
  color: string;
  textColor: string;
  borderColor: string;
  articles: Article[];
}

export interface OpinionItem {
  id: number;
  media: string;
  stance: 'progressive' | 'neutral' | 'conservative';
  score: number;
  bg: string;
  border: string;
  textHighlight: string;
  title: string;
  analysisTitle: string;
  description: string;
  sources: string[];
}

export interface SearchIssue {
  id: number;
  title: string;
  description: string;
  points: string[];
  coverage: number;
  pattern: string;
}

export interface MockNewsItem {
  id: number;
  media: string;
  time: string;
  title: string;
}

export interface Quote {
  id: number;
  media: string;
  type: 'progressive' | 'neutral' | 'conservative';
  bg: string;
  textColor: string;
  borderColor: string;
  text: string;
  links: string[];
}
