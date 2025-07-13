'use client';

import { useState } from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Avatar,
  Typography,
  IconButton,
  Box,
  Chip,
  Divider,
  Button,
} from '@mui/material';
import {
  ThumbUp,
  ThumbUpOutlined,
  ChatBubbleOutline,
  Share,
  MoreVert,
} from '@mui/icons-material';

export interface PostData {
  id: string;
  author: {
    name: string;
    avatar: string;
    role: string;
  };
  content: string;
  images?: string[];
  createdAt: string;
  likes: number;
  comments: number;
  shares: number;
  isLiked?: boolean;
  tags?: string[];
}

interface PostProps {
  post: PostData;
  onLike?: (postId: string) => void;
  onComment?: (postId: string) => void;
  onShare?: (postId: string) => void;
}

export default function Post({ post, onLike, onComment, onShare }: PostProps) {
  const [isLiked, setIsLiked] = useState(post.isLiked || false);
  const [likesCount, setLikesCount] = useState(post.likes);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikesCount(isLiked ? likesCount - 1 : likesCount + 1);
    onLike?.(post.id);
  };

  const formatDate = (dateString: string) => {
    // Kiểm tra xem có đang chạy trên client không
    if (typeof window === 'undefined') {
      return dateString; // Fallback cho server-side rendering
    }

    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffInHours = Math.floor(
        (now.getTime() - date.getTime()) / (1000 * 60 * 60)
      );

      if (diffInHours < 1) return 'Vừa xong';
      if (diffInHours < 24) return `${diffInHours} giờ trước`;
      if (diffInHours < 48) return 'Hôm qua';
      return date.toLocaleDateString('vi-VN');
    } catch (error) {
      console.error('Lỗi format date:', error);
      return dateString; // Fallback nếu có lỗi
    }
  };

  return (
    <Card
      sx={{ mb: 2, borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
    >
      <CardHeader
        avatar={
          <Avatar
            src={post.author.avatar}
            alt={post.author.name}
            sx={{ width: 48, height: 48 }}
          />
        }
        action={
          <IconButton>
            <MoreVert />
          </IconButton>
        }
        title={
          <Box>
            <Typography variant="subtitle1" fontWeight={600}>
              {post.author.name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {post.author.role} • {formatDate(post.createdAt)}
            </Typography>
          </Box>
        }
      />

      <CardContent sx={{ pt: 0 }}>
        <Typography
          variant="body1"
          sx={{
            mb: 2,
            lineHeight: 1.6,
            '& img': { maxWidth: '100%', height: 'auto' },
          }}
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {post.images && post.images.length > 0 && (
          <Box sx={{ mb: 2 }}>
            {post.images.length === 1 ? (
              <img
                src={post.images[0]}
                alt="Post image"
                style={{
                  width: '100%',
                  maxHeight: 400,
                  objectFit: 'cover',
                  borderRadius: 8,
                }}
              />
            ) : (
              <Box
                sx={{
                  display: 'grid',
                  gap: 1,
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                }}
              >
                {post.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Post image ${index + 1}`}
                    style={{
                      width: '100%',
                      height: 200,
                      objectFit: 'cover',
                      borderRadius: 8,
                    }}
                  />
                ))}
              </Box>
            )}
          </Box>
        )}

        {post.tags && post.tags.length > 0 && (
          <Box sx={{ mb: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {post.tags.map((tag, index) => (
              <Chip
                key={index}
                label={`#${tag}`}
                size="small"
                color="primary"
                variant="outlined"
              />
            ))}
          </Box>
        )}
      </CardContent>

      <Divider />

      <CardActions sx={{ px: 2, py: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1 }}>
          <Typography variant="caption" color="text.secondary">
            {likesCount} lượt thích
          </Typography>
          <Typography variant="caption" color="text.secondary">
            •
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {post.comments} bình luận
          </Typography>
          <Typography variant="caption" color="text.secondary">
            •
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {post.shares} lượt chia sẻ
          </Typography>
        </Box>
      </CardActions>

      <Divider />

      <CardActions sx={{ px: 0, py: 0 }}>
        <Button
          fullWidth
          startIcon={
            isLiked ? <ThumbUp color="primary" /> : <ThumbUpOutlined />
          }
          onClick={handleLike}
          sx={{
            color: isLiked ? 'primary.main' : 'text.secondary',
            textTransform: 'none',
            py: 1.5,
          }}
        >
          Thích
        </Button>
        <Button
          fullWidth
          startIcon={<ChatBubbleOutline />}
          onClick={() => onComment?.(post.id)}
          sx={{
            color: 'text.secondary',
            textTransform: 'none',
            py: 1.5,
          }}
        >
          Bình luận
        </Button>
        <Button
          fullWidth
          startIcon={<Share />}
          onClick={() => onShare?.(post.id)}
          sx={{
            color: 'text.secondary',
            textTransform: 'none',
            py: 1.5,
          }}
        >
          Chia sẻ
        </Button>
      </CardActions>
    </Card>
  );
}
