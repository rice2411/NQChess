'use client';

import { useEffect, useState } from 'react';
import Post, { PostData } from '@/components/ui/Post';
import { Box, Container, Typography } from '@mui/material';

const staticPosts: PostData[] = [
  {
    id: '1',
    author: {
      name: 'Nguyễn Văn A',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      role: 'Học viên',
    },
    content: '<p>Đây là bài viết đầu tiên! <b>Chào mọi người!</b></p>',
    images: [
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
    ],
    createdAt: '2024-06-01T10:00:00.000Z',
    likes: 12,
    comments: 3,
    shares: 1,
    isLiked: false,
    tags: ['chess', 'welcome'],
  },
  {
    id: '2',
    author: {
      name: 'Trần Thị B',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
      role: 'Giáo viên',
    },
    content: '<p>Hôm nay lớp mình học rất vui! <img src="https://cdn-icons-png.flaticon.com/512/616/616489.png" width="20" /></p>',
    images: [
      'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=600&q=80',
    ],
    createdAt: '2024-05-31T15:00:00.000Z',
    likes: 25,
    comments: 7,
    shares: 2,
    isLiked: true,
    tags: ['class', 'fun'],
  },
  {
    id: '3',
    author: {
      name: 'Lê Văn C',
      avatar: 'https://randomuser.me/api/portraits/men/65.jpg',
      role: 'Học viên',
    },
    content: '<p>Mọi người có ai muốn giao lưu cờ vua không? <i>Comment bên dưới nhé!</i></p>',
    createdAt: '2024-05-30T08:00:00.000Z',
    likes: 5,
    comments: 1,
    shares: 0,
    isLiked: false,
    tags: ['giao_luu'],
  },
];

export default function HomePage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <Container maxWidth="sm" disableGutters sx={{ py: 4, pt: { xs: 10, sm: 12 } }}>
      <Typography variant="h5" fontWeight={700} mb={3} align="center" color="primary">
        Bảng tin lớp học
      </Typography>
      <Box>
        {staticPosts.map((post) => (
          <Post key={post.id} post={post} />
        ))}
      </Box>
    </Container>
  );
}
