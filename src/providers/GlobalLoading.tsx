'use client';
import { useState, useEffect } from 'react';
import { useGlobalLoadingStore } from '@/store/useGlobalLoadingStore';
import { Box, CircularProgress, Typography, Fade } from '@mui/material';

export default function GlobalLoading() {
  const [mounted, setMounted] = useState(false);
  const loading = useGlobalLoadingStore(state => state.loading);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !loading) return null;

  return (
    <Fade in={loading} timeout={200}>
      <Box
        sx={{
          position: 'fixed',
          zIndex: 2000,
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          bgcolor: 'rgba(255,255,255,0.9)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2,
        }}
      >
        <CircularProgress
          size={60}
          color="primary"
          thickness={4}
          sx={{
            animation: 'pulse 2s ease-in-out infinite',
            '@keyframes pulse': {
              '0%': {
                transform: 'scale(1)',
              },
              '50%': {
                transform: 'scale(1.05)',
              },
              '100%': {
                transform: 'scale(1)',
              },
            },
          }}
        />
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            fontWeight: 500,
            animation: 'fadeInOut 2s ease-in-out infinite',
            '@keyframes fadeInOut': {
              '0%, 100%': {
                opacity: 0.6,
              },
              '50%': {
                opacity: 1,
              },
            },
          }}
        >
          Đang tải...
        </Typography>
      </Box>
    </Fade>
  );
}
