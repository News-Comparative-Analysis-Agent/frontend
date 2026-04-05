import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DraftState } from '../types/store';
import { stripDiffTags } from '../utils/patchUtils';

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
      pastContent: [],
      futureContent: [],
      sidebarQuotes: [],
      lastSaved: null,
      isDirty: false,

      // 기본 상태 변경 액션
      setIssueId: (currentIssueId) => set({ currentIssueId, isDirty: false, pastContent: [], futureContent: [] }),
      setTitle: (title) => set({ title, isDirty: true }),
      
      setContent: (newContent, skipDirty = false) => set((state) => {
        // 💡 저장 전 하이라이트 태그 오염 여부를 체크하고 세척합니다.
        const cleanedContent = stripDiffTags(newContent);
        if (state.content === cleanedContent) return state;
        return { 
          content: cleanedContent, 
          isDirty: skipDirty ? state.isDirty : true 
        };
      }),

      setSidebarQuotes: (sidebarQuotes) => set({ sidebarQuotes, isDirty: true }),
      
      // History 액션 (챗봇 전용으로 활용 예정)
      undo: () => set((state) => {
        if (state.pastContent.length === 0) return state;
        
        const previous = state.pastContent[state.pastContent.length - 1];
        const newPast = state.pastContent.slice(0, -1);
        
        return {
          content: previous,
          pastContent: newPast,
          futureContent: [state.content, ...state.futureContent],
          isDirty: true
        };
      }),

      redo: () => set((state) => {
        if (state.futureContent.length === 0) return state;
        
        const next = state.futureContent[0];
        const newFuture = state.futureContent.slice(1);
        
        return {
          content: next,
          pastContent: [...state.pastContent, state.content],
          futureContent: newFuture,
          isDirty: true
        };
      }),

      // 명시적으로 히스토리에 현재 상태 기록 (챗봇 반영 직전 호출용)
      pushHistory: () => set((state) => {
        const newPast = [...state.pastContent, state.content];
        if (newPast.length > 20) newPast.shift();
        return { pastContent: newPast, futureContent: [] };
      }),
      
      // 기사 인용구 관리 전용 액션
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

      // 💡 인라인 Diff 리뷰 모드 상태 및 액션 구현
      pendingDiff: null,
      setPendingDiff: (pendingDiff) => set({ pendingDiff }),
    }),
    {
      name: 'draft-storage',
      // 💡 pendingDiff는 일시적인 UI 상태이므로 로컬 스토리지 저장 대상에서 제외합니다.
      partialize: (state) => {
        const { pendingDiff, ...rest } = state;
        return rest;
      },
    }
  )
);
