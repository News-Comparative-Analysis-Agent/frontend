import { create } from 'zustand';

interface UserState {
  isLoggedIn: boolean;
  accessToken: string | null;
  user: {
    nickname: string;
    email: string;
    id: number;
    created_at?: string;
    role?: string;
    avatar?: string;
  } | null;
  login: (userData: any, token: string) => void;
  logout: () => void;
}

export const useUserStore = create<UserState>((set) => {
  // 앱 초기화 시 localStorage에서 토큰 확인
  const savedToken = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

  return {
    isLoggedIn: !!savedToken, // 토큰이 있으면 로그인 상태로 간주
    accessToken: savedToken,
    user: savedToken ? {
      nickname: 'Guest 개발자',
      email: 'dev@test.com',
      id: 0,
      avatar: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png'
    } : null,
    login: (userData, token) => {
      localStorage.setItem('accessToken', token);
      set({ 
        isLoggedIn: true,
        accessToken: token,
        user: userData
      });
    },
    logout: () => {
      localStorage.removeItem('accessToken');
      set({ isLoggedIn: false, accessToken: null, user: null });
    },
  };
});
