import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { apiClient } from './api.client';

interface AdminUser {
  id: string;
  email: string;
  nome: string;
  cognome: string;
  ruolo: string;
  avatarUrl?: string;
}

interface AuthState {
  user: AdminUser | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
  setToken: (token: string) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,

      login: async (email: string, password: string) => {
        const { data } = await apiClient.post('/auth/login', { email, password });
        set({
          user: data.user,
          accessToken: data.accessToken,
          isAuthenticated: true,
        });
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${data.accessToken}`;
      },

      logout: async () => {
        try {
          await apiClient.post('/auth/logout');
        } finally {
          set({ user: null, accessToken: null, isAuthenticated: false });
          delete apiClient.defaults.headers.common['Authorization'];
        }
      },

      refreshToken: async () => {
        const { data } = await apiClient.post('/auth/refresh');
        set({ accessToken: data.accessToken, isAuthenticated: true });
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${data.accessToken}`;
      },

      setToken: (token: string) => {
        set({ accessToken: token, isAuthenticated: true });
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      },
    }),
    {
      name: 'hornets-auth',
      partialize: (state) => ({ user: state.user, accessToken: state.accessToken, isAuthenticated: state.isAuthenticated }),
    }
  )
);
