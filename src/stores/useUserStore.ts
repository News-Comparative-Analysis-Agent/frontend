import { create } from 'zustand';

interface UserState {
  isLoggedIn: boolean;
  user: {
    name: string;
    email: string;
    role: string;
    avatar?: string;
  } | null;
  login: () => void;
  logout: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  isLoggedIn: true, // 초기 기획안에 맞춰 로그인된 상태로 시작
  user: {
    name: '김태현 기자',
    email: 'politics_editor@insight-hub.com',
    role: '정치부 차장',
  },
  login: () => set({ isLoggedIn: true }),
  logout: () => set({ isLoggedIn: false, user: null }),
}));
