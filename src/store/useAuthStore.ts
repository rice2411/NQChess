'use client';
import { create } from 'zustand';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';

interface AuthState {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  getUserInfo: () => {
    id: string;
    name: string;
    email: string;
    avatar: string;
  } | null;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  loading: true,
  setUser: user => set({ user }),
  setLoading: loading => set({ loading }),
  getUserInfo: () => {
    const { user } = get();
    if (!user) return null;

    return {
      id: user.uid,
      name: user.displayName || user.email?.split('@')[0] || 'Unknown User',
      email: user.email || '',
      avatar:
        user.photoURL ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || user.email?.split('@')[0] || 'U')}&background=random`,
    };
  },
}));

// Lắng nghe trạng thái đăng nhập toàn cục (chỉ gọi 1 lần ở client)
let _initialized = false;
export const initAuthListener = () => {
  if (_initialized) return;
  _initialized = true;
  const { setUser, setLoading } = useAuthStore.getState();
  setLoading(true);
  onAuthStateChanged(auth, user => {
    setUser(user);
    setLoading(false);
  });
};
