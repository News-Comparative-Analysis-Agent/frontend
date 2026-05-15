import { create } from 'zustand';
import { DraftState } from '../types/store';
import { saveDraft as saveDraftApi } from '../api/drafting';

/**
 * 초안 작성 및 기사 분석 상태를 관리하는 전역 스토어입니다.
 * 새로고침 시 초안은 API에서 다시 불러옵니다. (persist 미제거)
 */
export const useDraftStore = create<DraftState>()(
  (set, get) => ({
    currentIssueId: null,
    title: '',
    content: '',
    previewContent: null,
    pastContent: [],
    futureContent: [],
    sidebarQuotes: [],
    citations: [],
    lastSaved: null,
    isDirty: false,
    isSaving: false,
    isPreviewMode: false,

    setIssueId: (currentIssueId) => set({
      currentIssueId,
      isDirty: false,
      pastContent: [],
      futureContent: [],
      isPreviewMode: false,
      previewContent: null,
      citations: []
    }),
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
      return { previewContent: newPreview };
    }),
    setPreviewMode: (isPreviewMode) => set({ isPreviewMode }),

    setSidebarQuotes: (sidebarQuotes) => set({ sidebarQuotes, isDirty: true }),
    setCitations: (citations) => set({ citations }),

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

    pushHistory: (explicitContent?: string) => set((state) => {
      const contentToPush = explicitContent !== undefined ? explicitContent : state.content;
      if (state.pastContent.length > 0 && state.pastContent[state.pastContent.length - 1] === contentToPush) {
        return state;
      }
      const newPast = [...state.pastContent, contentToPush];
      if (newPast.length > 50) newPast.shift();
      return { pastContent: newPast, futureContent: [] };
    }),

    addSidebarQuote: (quote) => set((state) => ({
      sidebarQuotes: [...state.sidebarQuotes, quote],
      isDirty: true
    })),

    removeSidebarQuote: (quoteId) => set((state) => ({
      sidebarQuotes: state.sidebarQuotes.filter(q => q.id !== quoteId),
      isDirty: true
    })),

    saveDraft: async () => {
      const state = get();
      if (state.isPreviewMode || state.isSaving) {
        if (state.isPreviewMode) {
          alert('현재 AI 수정 제안 프리뷰 중입니다.\n제안을 [적용]하거나 [취소]한 후에 임시저장해 주세요.');
        }
        return;
      }
      if (!state.currentIssueId) {
        alert('이슈 ID를 확인할 수 없어 저장에 실패했습니다.');
        return;
      }
      set({ isSaving: true });
      try {
        await saveDraftApi({
          title: state.title,
          content: state.content,
          issue_id: Number(state.currentIssueId)
        });
        set({ lastSaved: new Date().toISOString(), isDirty: false });
      } catch (error) {
        console.error('임시 저장 실패:', error);
        alert('임시 저장 과정에서 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.');
      } finally {
        set({ isSaving: false });
      }
    },

    resetDraft: () => set({
      currentIssueId: null,
      title: '',
      content: '',
      previewContent: null,
      sidebarQuotes: [],
      citations: [],
      lastSaved: null,
      isDirty: false,
      isPreviewMode: false
    }),
    setIsDirty: (isDirty) => set({ isDirty }),
  })
);
