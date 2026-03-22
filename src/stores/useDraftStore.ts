import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DraftState } from '../types/store';

/**
 * 초안 작성 및 기사 분석 상태를 관리하는 전역 스토어입니다.
 * persist 미들웨어를 사용하여 브라우저 새로고침 후에도 데이터가 유지됩니다.
 */
export const useDraftStore = create<DraftState>()(
  persist(
    (set) => ({
      currentIssueId: null,
      title: '',
      content: '', 
      sidebarQuotes: [],
      lastSaved: null,

      // 기본 상태 변경 액션
      setIssueId: (currentIssueId) => set({ currentIssueId }),
      setTitle: (title) => set({ title }),
      setContent: (content) => set({ content }),
      setSidebarQuotes: (sidebarQuotes) => set({ sidebarQuotes }),
      
      // 기사 인용구 관리 전용 액션 (로직 중앙화)
      addSidebarQuote: (quote) => set((state) => ({
        sidebarQuotes: [...state.sidebarQuotes, quote]
      })),
      
      removeSidebarQuote: (quoteId) => set((state) => ({
        sidebarQuotes: state.sidebarQuotes.filter(q => q.id !== quoteId)
      })),

      // 저장 및 리셋
      saveDraft: () => set({ lastSaved: new Date().toISOString() }),
      resetDraft: () => set({ 
        currentIssueId: null, 
        title: '', 
        content: '', 
        sidebarQuotes: [], 
        lastSaved: null 
      }),
    }),
    {
      name: 'draft-storage',
    }
  )
);
