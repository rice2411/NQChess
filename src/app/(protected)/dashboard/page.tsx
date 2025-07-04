'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { CircularProgress, Box, Typography, Button } from '@mui/material';
import { signOutUser } from '@/lib/firebase-auth';
import { useGlobalLoadingStore } from '@/store/useGlobalLoadingStore';

export default function HelloUserPage() {
  const user = useAuthStore((state) => state.user);
  const loading = useAuthStore((state) => state.loading);
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
    if (!loading && user) {
      if (window.location.pathname === '/login') {
        router.replace('/hello-user');
      }
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <Box minHeight="100vh" display="flex" alignItems="center" justifyContent="center">
        <CircularProgress />
      </Box>
    );
  }

  if (!user) return null;

  const handleLogout = async () => {
    useGlobalLoadingStore.getState().setLoading(true);
    await signOutUser();
    useGlobalLoadingStore.getState().setLoading(false);
    router.replace('/login');
  };

  return (
    <Box minHeight="100vh" display="flex" flexDirection="column" alignItems="center" justifyContent="center">
      <Typography variant="h4" color="primary" gutterBottom>
        Xin chào, {user.email}
      </Typography>
      <Button variant="outlined" color="primary" onClick={handleLogout} sx={{ mt: 2 }}>
        Đăng xuất
      </Button>
    </Box>
  );
} 