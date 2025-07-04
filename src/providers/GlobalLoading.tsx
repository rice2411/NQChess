'use client';
import { useState, useEffect } from 'react';
import { useGlobalLoadingStore } from '@/store/useGlobalLoadingStore';
import { Box, CircularProgress } from '@mui/material';

export default function GlobalLoading() {
  const [mounted, setMounted] = useState(false);
  const loading = useGlobalLoadingStore((state) => state.loading);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !loading) return null;

  return (
    <Box
      sx={{
        position: 'fixed',
        zIndex: 2000,
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        bgcolor: 'rgba(255,255,255,0.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <CircularProgress size={60} color="primary" />
    </Box>
  );
} 