import { create } from 'zustand';

interface IssueState {
  activeIssueType: 'politics' | 'editorial';
  setActiveIssueType: (type: 'politics' | 'editorial') => void;
}

export const useIssueStore = create<IssueState>((set) => ({
  activeIssueType: 'politics',
  setActiveIssueType: (type) => set({ activeIssueType: type }),
}));
