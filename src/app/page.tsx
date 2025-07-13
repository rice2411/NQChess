'use client';

import { useEffect, useState } from 'react';
import Post, { PostData } from '@/components/ui/Post';
import {
  Box,
  Container,
  Typography,
  CircularProgress,
  Alert,
  Button,
  Avatar,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  School as SchoolIcon,
  Person as PersonIcon,
  Group as GroupIcon,
  Schedule as ScheduleIcon,
  LocationOn as LocationIcon,
} from '@mui/icons-material';
import { postService } from '@/services/post.service';

// Mock data cho giáo viên
const mockTeachers = [
  {
    id: '1',
    name: 'Nguyễn Văn An',
    avatar:
      'https://ui-avatars.com/api/?name=Nguyen+Van+An&background=4CAF50&color=fff',
    subject: 'Toán học',
    experience: '5 năm',
    rating: 4.8,
    students: 45,
  },
  {
    id: '2',
    name: 'Trần Thị Bình',
    avatar:
      'https://ui-avatars.com/api/?name=Tran+Thi+Binh&background=2196F3&color=fff',
    subject: 'Văn học',
    experience: '3 năm',
    rating: 4.6,
    students: 38,
  },
  {
    id: '3',
    name: 'Lê Văn Cường',
    avatar:
      'https://ui-avatars.com/api/?name=Le+Van+Cuong&background=FF9800&color=fff',
    subject: 'Vật lý',
    experience: '7 năm',
    rating: 4.9,
    students: 52,
  },
];

// Mock data cho lớp học
const mockClasses = [
  {
    id: '1',
    name: 'Lớp 10A1',
    subject: 'Toán học',
    teacher: 'Nguyễn Văn An',
    students: 35,
    schedule: 'Thứ 2, 4, 6 - 19:00-21:00',
    location: 'Phòng 101',
    status: 'active',
  },
  {
    id: '2',
    name: 'Lớp 11B2',
    subject: 'Văn học',
    teacher: 'Trần Thị Bình',
    students: 28,
    schedule: 'Thứ 3, 5, 7 - 18:00-20:00',
    location: 'Phòng 205',
    status: 'active',
  },
  {
    id: '3',
    name: 'Lớp 12C3',
    subject: 'Vật lý',
    teacher: 'Lê Văn Cường',
    students: 32,
    schedule: 'Thứ 2, 4, 6 - 20:00-22:00',
    location: 'Phòng 301',
    status: 'active',
  },
  {
    id: '4',
    name: 'Lớp 10A2',
    subject: 'Hóa học',
    teacher: 'Phạm Thị Dung',
    students: 30,
    schedule: 'Thứ 3, 5, 7 - 19:00-21:00',
    location: 'Phòng 102',
    status: 'active',
  },
];

export default function HomePage() {
  const [posts, setPosts] = useState<PostData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      fetchPosts();
    }
  }, [mounted]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);

      // Lấy tất cả bài viết đã xuất bản
      const firebasePosts = await postService.getAllPosts();

      // Chuyển đổi từ Post interface sang PostData
      const convertedPosts: PostData[] = firebasePosts
        // .filter(post => post.status === 'published') // Chỉ hiển thị bài viết đã xuất bản
        .map(post => ({
          id: post.id,
          author: {
            name: post.authorName || 'Unknown User',
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(post.authorName || 'U')}&background=random`,
            role: 'User',
          },
          content: post.content,
          images:
            post.images || (post.featuredImage ? [post.featuredImage] : []), // Sử dụng images nếu có, fallback về featuredImage
          createdAt: post.createdAt,
          likes: 0, // TODO: Implement likes system
          comments: 0, // TODO: Implement comments system
          shares: 0, // TODO: Implement shares system
          isLiked: false,
          tags: post.tags || [],
        }))
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        ); // Sắp xếp theo thời gian mới nhất

      setPosts(convertedPosts);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setError('Không thể tải bài viết. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchPosts();
  };

  if (!mounted) return null;

  return (
    <Container
      maxWidth="xl"
      disableGutters
      sx={{ py: 4, pt: { xs: 10, sm: 12 } }}
    >
      <Box
        sx={{
          display: 'flex',
          gap: 3,
          flexDirection: { xs: 'column', md: 'row' },
        }}
      >
        {/* Cột trái - Thông tin giáo viên */}
        <Box sx={{ width: { xs: '100%', md: '25%' }, minWidth: { md: 280 } }}>
          <Paper
            elevation={2}
            sx={{ p: 2, height: 'fit-content', position: 'sticky', top: 20 }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <PersonIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6" fontWeight={600}>
                Giáo viên nổi bật
              </Typography>
            </Box>

            <List sx={{ p: 0 }}>
              {mockTeachers.map((teacher, index) => (
                <Box key={teacher.id}>
                  <ListItem sx={{ px: 0, py: 1 }}>
                    <ListItemAvatar>
                      <Avatar src={teacher.avatar} alt={teacher.name} />
                    </ListItemAvatar>
                    <ListItemText
                      primary={teacher.name}
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            {teacher.subject}
                          </Typography>
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              mt: 0.5,
                            }}
                          >
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              sx={{ mr: 1 }}
                            >
                              {teacher.experience} • {teacher.students} học sinh
                            </Typography>
                            <Chip
                              label={`${teacher.rating}⭐`}
                              size="small"
                              color="primary"
                              variant="outlined"
                            />
                          </Box>
                        </Box>
                      }
                    />
                  </ListItem>
                  {index < mockTeachers.length - 1 && <Divider />}
                </Box>
              ))}
            </List>
          </Paper>
        </Box>

        {/* Cột giữa - Bài viết */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
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

        {/* Cột phải - Thông tin lớp học */}
        <Box sx={{ width: { xs: '100%', md: '25%' }, minWidth: { md: 280 } }}>
          <Paper
            elevation={2}
            sx={{ p: 2, height: 'fit-content', position: 'sticky', top: 20 }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <SchoolIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6" fontWeight={600}>
                Lớp học đang hoạt động
              </Typography>
            </Box>

            <List sx={{ p: 0 }}>
              {mockClasses.map((classItem, index) => (
                <Box key={classItem.id}>
                  <ListItem sx={{ px: 0, py: 1.5 }}>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: 'primary.main' }}>
                        <GroupIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={classItem.name}
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            {classItem.subject} • {classItem.teacher}
                          </Typography>
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              mt: 0.5,
                            }}
                          >
                            <ScheduleIcon
                              fontSize="small"
                              sx={{ mr: 0.5, color: 'text.secondary' }}
                            />
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              sx={{ mr: 1 }}
                            >
                              {classItem.schedule}
                            </Typography>
                          </Box>
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              mt: 0.5,
                            }}
                          >
                            <LocationIcon
                              fontSize="small"
                              sx={{ mr: 0.5, color: 'text.secondary' }}
                            />
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {classItem.location} • {classItem.students} học
                              sinh
                            </Typography>
                          </Box>
                        </Box>
                      }
                    />
                  </ListItem>
                  {index < mockClasses.length - 1 && <Divider />}
                </Box>
              ))}
            </List>
          </Paper>
        </Box>
      </Box>
    </Container>
  );
}
