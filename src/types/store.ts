import { SidebarQuote } from './analysis';

export interface DraftState {
  currentIssueId: string | null;
  title: string;
  content: string;
  pastContent: string[];
  futureContent: string[];
  sidebarQuotes: SidebarQuote[];
  lastSaved: string | null;
  isDirty: boolean;
  
  // Actions
  setIssueId: (id: string | null) => void;
  setTitle: (title: string) => void;
  setContent: (content: string, skipDirty?: boolean) => void;
  setSidebarQuotes: (quotes: SidebarQuote[]) => void;
  saveDraft: () => Promise<void>;
  resetDraft: () => void;
  setIsDirty: (isDirty: boolean) => void;
  
  // History Actions
  undo: () => void;
  redo: () => void;
  pushHistory: () => void;
  
  // Advanced Actions (Logic Migration)
  addSidebarQuote: (quote: SidebarQuote) => void;
  removeSidebarQuote: (quoteId: number) => void;
}
