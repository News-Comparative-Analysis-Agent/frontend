import { create } from 'zustand';

interface User {
  nickname: string;
  email: string;
  id: number;
  created_at?: string;
  role?: string;
  avatar?: string;
}

interface UserState {
  isLoggedIn: boolean;
  accessToken: string | null;
  user: User | null;
  isLoginModalOpen: boolean;
  login: (userData: User | null, token: string) => void;
  logout: () => void;
  setLoginModalOpen: (open: boolean) => void;
}

export const useUserStore = create<UserState>((set) => {
  // 앱 초기화 시 localStorage에서 토큰 확인
  const savedToken = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

  return {
    isLoggedIn: !!savedToken,
    accessToken: savedToken,
    user: null,
    isLoginModalOpen: !savedToken,
    login: (userData, token) => {
      localStorage.setItem('accessToken', token);
      set({
        isLoggedIn: true,
        accessToken: token,
        user: userData,
        isLoginModalOpen: false,
      });
    },
    logout: () => {
      localStorage.removeItem('accessToken');
      set({ isLoggedIn: false, accessToken: null, user: null, isLoginModalOpen: true });
    },
    setLoginModalOpen: (open) => set({ isLoginModalOpen: open }),
  };
});
