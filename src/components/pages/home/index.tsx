'use client';

import { useEffect, useState } from 'react';
import { Box, Container, Fab, Zoom } from '@mui/material';
import { KeyboardArrowUp as KeyboardArrowUpIcon } from '@mui/icons-material';
import SearchStudent from './SearchStudent';
import TeacherHighlight from './TeacherHighlight';
import ClassHighlight from './ClassHighlight';
import ListPosts from './ListPosts';

export default function HomePageComponent() {
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const shouldShow = window.scrollY > 1;
      setShowBackToTop(shouldShow);
    };

    // Thêm passive: true để tối ưu performance và đảm bảo phản ứng ngay lập tức
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleBackToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  if (!mounted) return null;

  return (
    <Container
      maxWidth="xl"
      disableGutters
      sx={{ py: 4, pt: { xs: 10, sm: 12 } }}
    >
      {/* Section Tìm kiếm học sinh */}
      <SearchStudent />

      {/* Layout chính */}
      <Box
        sx={{
          display: 'flex',
          gap: 3,
          flexDirection: { xs: 'column', md: 'row' },
          justifyContent: 'center',
        }}
      >
        {/* Cột trái - Thông tin giáo viên */}
        <TeacherHighlight />

        {/* Cột giữa - Bài viết */}
        <ListPosts />

        {/* Cột phải - Thông tin lớp học */}
        <ClassHighlight />
      </Box>

      {/* Nút Back to Top */}
      <Zoom in={showBackToTop} timeout={150} style={{ transitionDelay: '0ms' }}>
        <Fab
          color="primary"
          size="small"
          onClick={handleBackToTop}
          sx={{
            position: 'fixed',
            bottom: 20,
            right: 20,
            transition: 'all 0.15s ease-in-out',
          }}
        >
          <KeyboardArrowUpIcon />
        </Fab>
      </Zoom>
    </Container>
  );
}
