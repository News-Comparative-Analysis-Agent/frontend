import { SidebarQuote } from './analysis';

export interface DraftState {
  currentIssueId: string | null;
  title: string;
  content: string;
  sidebarQuotes: SidebarQuote[];
  lastSaved: string | null;
  
  // Actions
  setIssueId: (id: string | null) => void;
  setTitle: (title: string) => void;
  setContent: (content: string) => void;
  setSidebarQuotes: (quotes: SidebarQuote[]) => void;
  saveDraft: () => void;
  resetDraft: () => void;
  
  // Advanced Actions (Logic Migration)
  addSidebarQuote: (quote: SidebarQuote) => void;
  removeSidebarQuote: (quoteId: number) => void;
}
