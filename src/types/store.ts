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
  isSaving: boolean; // 💡 임시 저장 진행 중 여부
  isPreviewMode: boolean; // 💡 AI 수정 제안 프리뷰 모드 여부
  previewContent: string | null; // 💡 AI 수정 제안 임시 하이라이트 HTML
  
  // Actions
  setIssueId: (id: string | null) => void;
  setTitle: (title: string) => void;
  setContent: (content: string, skipDirty?: boolean) => void;
  setPreviewContent: (content: string | null) => void; // 💡 프리뷰 내용 설정
  setPreviewMode: (val: boolean) => void; // 💡 프리뷰 상태 설정
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
