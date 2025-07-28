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
import { UserService } from '@/services/user.service';
import { ClassService } from '@/services/class.service';
import { EUserRole } from '@/interfaces/user.interface';

export default function HomePage() {
  const [posts, setPosts] = useState<PostData[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      fetchData();
    }
  }, [mounted]);

  const fetchData = async () => {
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

      // Fetch teachers từ bảng users
      const allUsers = await UserService.getAllUsers();
      const teacherUsers = allUsers.filter(
        user => user.role === EUserRole.TEACHER
      );

      // Fetch classes để tính toán thống kê
      const allClasses = await ClassService.getClasses(1, 1000); // Lấy tất cả classes

      // Tạo data cho teachers với thống kê từ classes
      const teachersData = teacherUsers.map(teacher => {
        // Tính số lớp học của giáo viên này
        const teacherClasses = allClasses.classes.filter(
          cls => cls.teacherId === teacher.id
        );
        const totalStudents = teacherClasses.reduce(
          (sum, cls) => sum + (cls.students?.length || 0),
          0
        );

        return {
          id: teacher.id,
          name: teacher.fullName,
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(teacher.fullName)}&background=random`,
          subject: 'Cờ vua', // Môn học mặc định
          experience: '2 năm', // Kinh nghiệm mặc định
          rating: 4.5 + Math.random() * 0.5, // Rating ngẫu nhiên 4.5-5.0
          students: totalStudents,
        };
      });

      setTeachers(teachersData);

      // Tạo data cho classes
      const classesData = allClasses.classes
        .slice(0, 4) // Chỉ hiển thị 4 lớp đầu tiên
        .map(cls => {
          // Tìm tên giáo viên
          const teacher = teacherUsers.find(t => t.id === cls.teacherId);

          return {
            id: cls.id,
            name: cls.name,
            subject: 'Cờ vua',
            teacher: teacher ? teacher.fullName : 'Chưa phân công',
            students: cls.students?.length || 0,
            schedule: cls.schedules?.join(', ') || 'Chưa có lịch',
            location: 'Phòng học chính',
            status: 'active',
          };
        });

      setClasses(classesData);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Không thể tải dữ liệu. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchData();
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
              {teachers.length > 0 ? (
                teachers.map((teacher, index) => (
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
                                {teacher.experience} • {teacher.students} học
                                sinh
                              </Typography>
                              <Chip
                                label={`${teacher.rating.toFixed(1)}⭐`}
                                size="small"
                                color="primary"
                                variant="outlined"
                              />
                            </Box>
                          </Box>
                        }
                      />
                    </ListItem>
                    {index < teachers.length - 1 && <Divider />}
                  </Box>
                ))
              ) : (
                <Box sx={{ textAlign: 'center', py: 2 }}>
                  <Typography color="text.secondary" variant="body2">
                    {loading ? 'Đang tải...' : 'Chưa có giáo viên nào'}
                  </Typography>
                </Box>
              )}
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
              {classes.length > 0 ? (
                classes.map((classItem, index) => (
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
                    {index < classes.length - 1 && <Divider />}
                  </Box>
                ))
              ) : (
                <Box sx={{ textAlign: 'center', py: 2 }}>
                  <Typography color="text.secondary" variant="body2">
                    {loading ? 'Đang tải...' : 'Chưa có lớp học nào'}
                  </Typography>
                </Box>
              )}
            </List>
          </Paper>
        </Box>
      </Box>
    </Container>
  );
}
