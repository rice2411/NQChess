'use client';

import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Alert,
} from '@mui/material';
import { Refresh as RefreshIcon } from '@mui/icons-material';
import Post, { PostData } from '@/components/ui/Post';
import { postService } from '@/services/post.service';

export default function ListPosts() {
  const [posts, setPosts] = useState<PostData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch posts
      const firebasePosts = await postService.getAllPosts();
      const convertedPosts: PostData[] = firebasePosts
        .map(post => ({
          id: post.id,
          author: {
            name: post.authorName || 'Unknown User',
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(post.authorName || 'U')}&background=random`,
            role: 'User',
          },
          content: post.content,
          images:
            post.images || (post.featuredImage ? [post.featuredImage] : []),
          createdAt: post.createdAt,
          likes: 0,
          comments: 0,
          shares: 0,
          isLiked: false,
          tags: post.tags || [],
        }))
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

      setPosts(convertedPosts);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setError('Không thể tải dữ liệu. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchPosts();
  };

  return (
    <Box sx={{ flex: 1, maxWidth: '40%' }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 3,
        }}
      >
        <Typography variant="h5" fontWeight={700} color="primary">
          Bảng tin lớp học
        </Typography>
        <Button
          startIcon={<RefreshIcon />}
          onClick={handleRefresh}
          disabled={loading}
          size="small"
        >
          Làm mới
        </Button>
      </Box>

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {!loading && !error && posts.length === 0 && (
        <Alert severity="info" sx={{ mb: 2 }}>
          Chưa có bài viết nào. Hãy là người đầu tiên chia sẻ!
        </Alert>
      )}

      {!loading && !error && posts.length > 0 && (
        <Box>
          {posts.map(post => (
            <Post key={post.id} post={post} />
          ))}
        </Box>
      )}
    </Box>
  );
}
