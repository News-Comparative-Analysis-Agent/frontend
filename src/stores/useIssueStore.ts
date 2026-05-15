import { create } from 'zustand';

interface IssueState {
  activeIssueType: 'politics' | 'editorial';
  setActiveIssueType: (type: 'politics' | 'editorial') => void;
}

export const useIssueStore = create<IssueState>((set) => {
  const savedType = typeof window !== 'undefined' ? localStorage.getItem('activeIssueType') : null;
  
  return {
    activeIssueType: (savedType as 'politics' | 'editorial') || 'politics',
    setActiveIssueType: (type) => {
      localStorage.setItem('activeIssueType', type);
      set({ activeIssueType: type });
    },
  };
});
