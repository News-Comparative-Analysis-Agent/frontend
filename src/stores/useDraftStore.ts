import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface DraftState {
  title: string;
  content: string;
  lastSaved: string | null;
  setTitle: (title: string) => void;
  setContent: (content: string) => void;
  saveDraft: () => void;
  resetDraft: () => void;
}

export const useDraftStore = create<DraftState>()(
  persist(
    (set) => ({
      title: '정청래발 ‘합당 파동’ 중단… 당내 갈등·정략적 리더십 상처만 남았다',
      content: '', // 실제 에디터 내용은 AnalysisPage 등에서 넘어옴
      lastSaved: null,
      setTitle: (title) => set({ title }),
      setContent: (content) => set({ content }),
      saveDraft: () => set({ lastSaved: new Date().toISOString() }),
      resetDraft: () => set({ title: '', content: '', lastSaved: null }),
    }),
    {
      name: 'draft-storage', // localStorage에 저장될 키 이름
    }
  )
);
