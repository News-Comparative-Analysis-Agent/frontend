import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DraftState } from '../types/store';

/**
 * 초안 작성 및 기사 분석 상태를 관리하는 전역 스토어입니다.
 * persist 미들웨어를 사용하여 브라우저 새로고침 후에도 데이터가 유지됩니다.
 */
export const useDraftStore = create<DraftState>()(
  persist(
    (set, get) => ({
      currentIssueId: null,
      title: '',
      content: '', 
      previewContent: null, // AI 제안용 임시 공간
      pastContent: [],
      futureContent: [],
      sidebarQuotes: [],
      lastSaved: null,
      isDirty: false,
      isPreviewMode: false,

      // 기본 상태 변경 액션
      setIssueId: (currentIssueId) => set({ currentIssueId, isDirty: false, pastContent: [], futureContent: [], isPreviewMode: false, previewContent: null }),
      setTitle: (title) => set({ title, isDirty: true }),
      
      setContent: (newContent, skipDirty = false) => set((state) => {
        if (state.content === newContent) return state;
        return { 
          content: newContent, 
          isDirty: skipDirty ? state.isDirty : true 
        };
      }),

      setPreviewContent: (newPreview) => set((state) => {
        if (state.previewContent === newPreview) return state;
        return { 
          previewContent: newPreview, 
          isDirty: true // 💡 프리뷰 도중 수정해도 변경된 것으로 간주
        };
      }),
      setPreviewMode: (isPreviewMode) => set({ isPreviewMode }),

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
        const state = get();
        
        // 💡 [Option A] 프리뷰 모드일 경우 저장 차단
        if (state.isPreviewMode) {
          alert('현재 AI 수정 제안 프리뷰 중입니다.\n제안을 [적용]하거나 [취소]한 후에 임시저장해 주세요.');
          return;
        }

        // 실제 API 연동 시 이곳에서 비동기 작업 수행 (현재는 더미 구현)
        set({ lastSaved: new Date().toISOString(), isDirty: false })
      },
      resetDraft: () => set({ 
        currentIssueId: null, 
        title: '', 
        content: '', 
        previewContent: null,
        sidebarQuotes: [], 
        lastSaved: null,
        isDirty: false,
        isPreviewMode: false
      }),
      setIsDirty: (isDirty) => set({ isDirty }),
    }),
    {
      name: 'draft-storage',
      // 💡 [오염 방지] previewContent와 isPreviewMode는 영구 저장에서 제외
      partialize: (state) => {
        const { previewContent, isPreviewMode, ...rest } = state;
        return rest;
      }
    }
  )
);
