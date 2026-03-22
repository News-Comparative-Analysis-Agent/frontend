import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface DraftState {
  currentIssueId: string | null;
  title: string;
  content: string;
  sidebarQuotes: any[]; // SidebarQuote 타입 대신 any 사용 (순환 참조 방지용)
  lastSaved: string | null;
  setIssueId: (id: string) => void;
  setTitle: (title: string) => void;
  setContent: (content: string) => void;
  setSidebarQuotes: (quotes: any[]) => void;
  saveDraft: () => void;
  resetDraft: () => void;
}

export const useDraftStore = create<DraftState>()(
  persist(
    (set) => ({
      currentIssueId: null,
      title: '',
      content: '', // 실제 에디터 내용은 AnalysisPage 등에서 넘어옴
      sidebarQuotes: [],
      lastSaved: null,
      setIssueId: (currentIssueId) => set({ currentIssueId }),
      setTitle: (title) => set({ title }),
      setContent: (content) => set({ content }),
      setSidebarQuotes: (sidebarQuotes) => set({ sidebarQuotes }),
      saveDraft: () => set({ lastSaved: new Date().toISOString() }),
      resetDraft: () => set({ currentIssueId: null, title: '', content: '', sidebarQuotes: [], lastSaved: null }),
    }),
    {
      name: 'draft-storage', // localStorage에 저장될 키 이름
    }
  )
);
