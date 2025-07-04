import { create } from 'zustand';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';

interface AuthState {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  setUser: (user) => set({ user }),
  setLoading: (loading) => set({ loading }),
}));

// Lắng nghe trạng thái đăng nhập toàn cục (chỉ gọi 1 lần ở client)
let _initialized = false;
export const initAuthListener = () => {
  if (_initialized) return;
  _initialized = true;
  const { setUser, setLoading } = useAuthStore.getState();
  setLoading(true);
  onAuthStateChanged(auth, (user) => {
    setUser(user);
    setLoading(false);
  });
}; 