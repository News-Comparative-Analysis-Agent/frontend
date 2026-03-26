import { SidebarQuote } from './analysis';

export interface DraftState {
  currentIssueId: string | null;
  title: string;
  content: string;
  sidebarQuotes: SidebarQuote[];
  lastSaved: string | null;
  isDirty: boolean;
  
  // Actions
  setIssueId: (id: string | null) => void;
  setTitle: (title: string) => void;
  setContent: (content: string) => void;
  setSidebarQuotes: (quotes: SidebarQuote[]) => void;
  saveDraft: () => Promise<void>;
  resetDraft: () => void;
  setIsDirty: (isDirty: boolean) => void;
  
  // Advanced Actions (Logic Migration)
  addSidebarQuote: (quote: SidebarQuote) => void;
  removeSidebarQuote: (quoteId: number) => void;
}
