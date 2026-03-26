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
      isDirty: false,

      // 기본 상태 변경 액션
      setIssueId: (currentIssueId) => set({ currentIssueId, isDirty: false }),
      setTitle: (title) => set({ title, isDirty: true }),
      setContent: (content) => set({ content, isDirty: true }),
      setSidebarQuotes: (sidebarQuotes) => set({ sidebarQuotes, isDirty: true }),
      
      // 기사 인용구 관리 전용 액션 (로직 중앙화)
      addSidebarQuote: (quote) => set((state) => ({
        sidebarQuotes: [...state.sidebarQuotes, quote],
        isDirty: true
      })),
      
      removeSidebarQuote: (quoteId) => set((state) => ({
        sidebarQuotes: state.sidebarQuotes.filter(q => q.id !== quoteId),
        isDirty: true
      })),

      // 저장 및 리셋
      saveDraft: async () => {
        // 실제 API 연동 시 이곳에서 비동기 작업 수행
        set({ lastSaved: new Date().toISOString(), isDirty: false })
      },
      resetDraft: () => set({ 
        currentIssueId: null, 
        title: '', 
        content: '', 
        sidebarQuotes: [], 
        lastSaved: null,
        isDirty: false
      }),
      setIsDirty: (isDirty) => set({ isDirty }),
    }),
    {
      name: 'draft-storage',
    }
  )
);
