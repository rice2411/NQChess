import { create } from 'zustand';

interface GlobalLoadingState {
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

export const useGlobalLoadingStore = create<GlobalLoadingState>((set) => ({
  loading: false,
  setLoading: (loading) => set({ loading }),
})); 