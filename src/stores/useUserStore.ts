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

export const useUserStore = create<UserState>((set) => ({
  isLoggedIn: false,
  accessToken: null,
  user: null,
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
}));
