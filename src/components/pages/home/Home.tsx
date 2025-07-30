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
  Fab,
  Zoom,
  TextField,
  InputAdornment,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { Grid } from '@mui/material';
import {
  Refresh as RefreshIcon,
  School as SchoolIcon,
  Person as PersonIcon,
  Group as GroupIcon,
  Schedule as ScheduleIcon,
  LocationOn as LocationIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon,
  Search as SearchIcon,
  PersonSearch as PersonSearchIcon,
  School as SchoolSearchIcon,
} from '@mui/icons-material';
import { postService } from '@/services/post.service';
import { UserService } from '@/services/user.service';
import { ClassService } from '@/services/class.service';
import { StudentService } from '@/services/student.service';
import { AttendanceService } from '@/services/attendance.service';
import { TuitionService } from '@/services/tuition.service';
import { EUserRole } from '@/interfaces/user.interface';

export default function HomePageComponent() {
  const [posts, setPosts] = useState<PostData[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // State cho tìm kiếm học sinh
  const [searchForm, setSearchForm] = useState({
    fullName: '',
    dateOfBirth: '',
    phoneNumber: '',
  });
  const [showStudentPopup, setShowStudentPopup] = useState(false);
  const [studentInfo, setStudentInfo] = useState<any>(null);
  const [searchLoading, setSearchLoading] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      fetchData();
    }
  }, [mounted]);

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

  const handleSearchStudent = async () => {
    const { fullName, dateOfBirth, phoneNumber } = searchForm;

    // Kiểm tra ít nhất 2 trường được nhập
    const filledFields = [fullName, dateOfBirth, phoneNumber].filter(field =>
      field.trim()
    ).length;
    if (filledFields < 2) {
      alert('Vui lòng nhập ít nhất 2 thông tin để tìm kiếm');
      return;
    }

    setSearchLoading(true);
    try {
      // Tìm kiếm học sinh theo thông tin
      let students: any[] = [];

      if (fullName.trim()) {
        const nameResults = await StudentService.searchStudentsByName(fullName);
        students = [...students, ...nameResults];
      }

      if (phoneNumber.trim()) {
        // Tìm kiếm theo số điện thoại
        const allStudents = await StudentService.getAllStudents();
        const phoneResults = allStudents.filter(student =>
          student.phoneNumber?.includes(phoneNumber)
        );
        students = [...students, ...phoneResults];
      }

      // Loại bỏ duplicate và filter theo ngày sinh nếu có
      const uniqueStudents = students.filter(
        (student, index, self) =>
          index === self.findIndex(s => s.id === student.id)
      );

      let filteredStudents = uniqueStudents;
      if (dateOfBirth.trim()) {
        filteredStudents = uniqueStudents.filter(
          student => student.dateOfBirth === dateOfBirth
        );
      }

      if (filteredStudents.length === 0) {
        alert(
          'Không tìm thấy học sinh với thông tin đã nhập. Vui lòng kiểm tra lại.'
        );
        return;
      }

      // Lấy thông tin chi tiết của học sinh đầu tiên
      const student = filteredStudents[0];

      // Lấy thông tin lớp học của học sinh
      const allClasses = await ClassService.getClasses(1, 1000);
      const studentClasses = allClasses.classes.filter(cls =>
        cls.students?.some(s => s.studentId === student.id)
      );

      // Lấy thông tin điểm danh
      const attendanceSummary =
        await AttendanceService.getStudentAttendanceSummary(student.id);

      // Lấy thông tin học phí
      const tuitions = await TuitionService.getTuitionByStudent(student.id);
      const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
      const currentTuition = tuitions.find(t => t.month === currentMonth);

      // Lấy lịch sử điểm danh gần đây
      const recentAttendance = await AttendanceService.getAttendanceByStudent(
        student.id,
        undefined, // classId - không filter theo lớp cụ thể
        1, // page
        5 // pageSize
      );

      // Tạo object thông tin chi tiết chỉ với dữ liệu thực tế
      const studentInfo = {
        id: student.id,
        fullName: student.fullName,
        dateOfBirth: student.dateOfBirth,
        phoneNumber: student.phoneNumber,
        // Chỉ sử dụng dữ liệu có sẵn từ interface
        classInfo:
          studentClasses.length > 0
            ? {
                id: studentClasses[0].id,
                name: studentClasses[0].name,
                teacherId: studentClasses[0].teacherId,
                schedule:
                  studentClasses[0].schedules?.join(', ') || 'Chưa có lịch',
                status: studentClasses[0].status,
                tuition: studentClasses[0].tuition,
              }
            : null,
        tuition: currentTuition
          ? {
              monthlyFee: currentTuition.amount,
              paidAmount: currentTuition.paidAmount || 0,
              remainingAmount:
                currentTuition.amount - (currentTuition.paidAmount || 0),
              nextPayment: currentTuition.dueDate || 'Chưa có thông tin',
              status: currentTuition.status,
            }
          : {
              monthlyFee: 0,
              paidAmount: 0,
              remainingAmount: 0,
              nextPayment: 'Chưa có thông tin',
              status: 'UNPAID',
            },
        attendance: {
          totalSessions: attendanceSummary.totalSessions,
          attendedSessions: attendanceSummary.presentSessions,
          absentSessions: attendanceSummary.absentSessions,
          lateSessions: attendanceSummary.lateSessions,
          excusedSessions: attendanceSummary.excusedSessions,
          attendanceRate: attendanceSummary.attendanceRate,
        },
        recentAttendance: recentAttendance.attendance.map(att => ({
          date: new Date(att.sessionDate).toLocaleDateString('vi-VN'),
          status:
            att.attendanceRecords?.find((r: any) => r.studentId === student.id)
              ?.status || 'ABSENT',
          note:
            att.attendanceRecords?.find((r: any) => r.studentId === student.id)
              ?.note || '',
          sessionTime: att.sessionTime,
        })),
      };

      setStudentInfo(studentInfo);
      setShowStudentPopup(true);
    } catch (error) {
      console.error('Error searching student:', error);
      alert('Có lỗi xảy ra khi tìm kiếm. Vui lòng thử lại sau.');
    } finally {
      setSearchLoading(false);
    }
  };

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
      {/* Section Tìm kiếm học sinh - Nổi bật nhất */}
      <Box sx={{ mb: 4, px: 2 }}>
        <Card
          elevation={3}
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            borderRadius: 3,
            overflow: 'visible',
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                gap: 3,
                alignItems: 'center',
              }}
            >
              {/* Phần thông tin */}
              <Box sx={{ flex: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <PersonSearchIcon sx={{ fontSize: 40, mr: 2 }} />
                  <Box>
                    <Typography variant="h4" fontWeight={700} gutterBottom>
                      Tìm kiếm học sinh
                    </Typography>
                    <Typography variant="body1" sx={{ opacity: 0.9 }}>
                      Phụ huynh có thể tra cứu thông tin học tập, điểm số và
                      lịch học của con em
                    </Typography>
                  </Box>
                </Box>
              </Box>

              {/* Phần tìm kiếm */}
              <Box sx={{ flex: 1 }}>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    mb: 2,
                  }}
                >
                  {/* 3 ô input tìm kiếm */}
                  <Box
                    sx={{
                      display: 'flex',
                      gap: 2,
                      flexDirection: { xs: 'column', sm: 'row' },
                    }}
                  >
                    <TextField
                      fullWidth
                      label="Họ và tên học sinh"
                      placeholder="Nhập họ tên..."
                      value={searchForm.fullName}
                      onChange={e =>
                        setSearchForm({
                          ...searchForm,
                          fullName: e.target.value,
                        })
                      }
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          backgroundColor: 'rgba(255, 255, 255, 0.9)',
                          borderRadius: 2,
                          '&:hover': {
                            backgroundColor: 'rgba(255, 255, 255, 1)',
                          },
                          '&.Mui-focused': {
                            backgroundColor: 'white',
                          },
                        },
                        '& .MuiInputLabel-root': {
                          color: 'rgba(255, 255, 255, 0.8)',
                        },
                      }}
                    />
                    <TextField
                      fullWidth
                      label="Ngày sinh"
                      placeholder="DD/MM/YYYY"
                      value={searchForm.dateOfBirth}
                      onChange={e =>
                        setSearchForm({
                          ...searchForm,
                          dateOfBirth: e.target.value,
                        })
                      }
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          backgroundColor: 'rgba(255, 255, 255, 0.9)',
                          borderRadius: 2,
                          '&:hover': {
                            backgroundColor: 'rgba(255, 255, 255, 1)',
                          },
                          '&.Mui-focused': {
                            backgroundColor: 'white',
                          },
                        },
                        '& .MuiInputLabel-root': {
                          color: 'rgba(255, 255, 255, 0.8)',
                        },
                      }}
                    />
                    <TextField
                      fullWidth
                      label="Số điện thoại"
                      placeholder="0123456789"
                      value={searchForm.phoneNumber}
                      onChange={e =>
                        setSearchForm({
                          ...searchForm,
                          phoneNumber: e.target.value,
                        })
                      }
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          backgroundColor: 'rgba(255, 255, 255, 0.9)',
                          borderRadius: 2,
                          '&:hover': {
                            backgroundColor: 'rgba(255, 255, 255, 1)',
                          },
                          '&.Mui-focused': {
                            backgroundColor: 'white',
                          },
                        },
                        '& .MuiInputLabel-root': {
                          color: 'rgba(255, 255, 255, 0.8)',
                        },
                      }}
                    />
                  </Box>

                  {/* Nút tìm kiếm */}
                  <Button
                    variant="contained"
                    size="large"
                    onClick={handleSearchStudent}
                    disabled={searchLoading}
                    startIcon={
                      searchLoading ? (
                        <CircularProgress size={20} color="inherit" />
                      ) : (
                        <SearchIcon />
                      )
                    }
                    sx={{
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                      color: 'white',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      borderRadius: 2,
                      px: 4,
                      py: 1.5,
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.3)',
                      },
                      '&:disabled': {
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      },
                    }}
                  >
                    {searchLoading ? 'Đang tìm kiếm...' : 'Tìm kiếm học sinh'}
                  </Button>
                </Box>

                {/* Quick Actions */}
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  <Chip
                    label="Xem điểm số"
                    size="small"
                    sx={{
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                      color: 'white',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.3)',
                      },
                    }}
                  />
                  <Chip
                    label="Lịch học"
                    size="small"
                    sx={{
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                      color: 'white',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.3)',
                      },
                    }}
                  />
                  <Chip
                    label="Điểm danh"
                    size="small"
                    sx={{
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                      color: 'white',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.3)',
                      },
                    }}
                  />
                </Box>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>

      <Box
        sx={{
          display: 'flex',
          gap: 3,
          flexDirection: { xs: 'column', md: 'row' },
          justifyContent: 'center',
        }}
      >
        {/* Cột trái - Thông tin giáo viên */}
        <Box
          sx={{
            width: { xs: '100%', md: '25%' },
            minWidth: { md: 280 },
            position: 'fixed',
            left: 10,
            top: 70,
          }}
        >
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
                        secondaryTypographyProps={{ component: 'div' }}
                        secondary={
                          <Box>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              component="span"
                            >
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
                                component="span"
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

        {/* Cột phải - Thông tin lớp học */}
        <Box
          sx={{
            width: { xs: '100%', md: '25%' },
            minWidth: { md: 280 },
            position: 'fixed',
            top: 70,
            right: 10,
          }}
        >
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
                        secondaryTypographyProps={{ component: 'div' }}
                        secondary={
                          <Box>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              component="span"
                            >
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
                                component="span"
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
                                component="span"
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

      {/* Popup Thông tin học sinh */}
      {showStudentPopup && studentInfo && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 1300,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            p: 2,
          }}
          onClick={() => setShowStudentPopup(false)}
        >
          <Paper
            sx={{
              maxWidth: 800,
              width: '100%',
              maxHeight: '90vh',
              overflow: 'auto',
              p: 3,
              borderRadius: 3,
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 3,
              }}
            >
              <Typography variant="h5" fontWeight={700} color="primary">
                Thông tin học sinh
              </Typography>
              <Button
                onClick={() => setShowStudentPopup(false)}
                sx={{ minWidth: 'auto', p: 1 }}
              >
                ✕
              </Button>
            </Box>

            {/* Thông tin cơ bản */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Thông tin cá nhân
              </Typography>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                  gap: 2,
                }}
              >
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Họ và tên
                  </Typography>
                  <Typography variant="body1" fontWeight={500}>
                    {studentInfo.fullName}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Ngày sinh
                  </Typography>
                  <Typography variant="body1" fontWeight={500}>
                    {studentInfo.dateOfBirth}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Số điện thoại
                  </Typography>
                  <Typography variant="body1" fontWeight={500}>
                    {studentInfo.phoneNumber}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Phụ huynh
                  </Typography>
                  <Typography variant="body1" fontWeight={500}>
                    {studentInfo.parentName}
                  </Typography>
                </Box>
                <Box sx={{ gridColumn: { xs: '1', md: '1 / -1' } }}>
                  <Typography variant="body2" color="text.secondary">
                    Địa chỉ
                  </Typography>
                  <Typography variant="body1" fontWeight={500}>
                    {studentInfo.address}
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* Thông tin lớp học */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Thông tin lớp học
              </Typography>
              <Paper elevation={1} sx={{ p: 2, backgroundColor: 'grey.50' }}>
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                    gap: 2,
                  }}
                >
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Tên lớp
                    </Typography>
                    <Typography variant="body1" fontWeight={500}>
                      {studentInfo.classInfo.name}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Giáo viên
                    </Typography>
                    <Typography variant="body1" fontWeight={500}>
                      {studentInfo.classInfo.teacher}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Lịch học
                    </Typography>
                    <Typography variant="body1" fontWeight={500}>
                      {studentInfo.classInfo.schedule}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Phòng học
                    </Typography>
                    <Typography variant="body1" fontWeight={500}>
                      {studentInfo.classInfo.room}
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </Box>

            {/* Thông tin học phí */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Thông tin học phí
              </Typography>
              <Paper elevation={1} sx={{ p: 2, backgroundColor: 'grey.50' }}>
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr' },
                    gap: 2,
                  }}
                >
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Học phí tháng
                    </Typography>
                    <Typography
                      variant="body1"
                      fontWeight={500}
                      color="primary"
                    >
                      {studentInfo.tuition.monthlyFee.toLocaleString()} VNĐ
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Đã thanh toán
                    </Typography>
                    <Typography
                      variant="body1"
                      fontWeight={500}
                      color="success.main"
                    >
                      {studentInfo.tuition.paidAmount.toLocaleString()} VNĐ
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Còn lại
                    </Typography>
                    <Typography
                      variant="body1"
                      fontWeight={500}
                      color="error.main"
                    >
                      {studentInfo.tuition.remainingAmount.toLocaleString()} VNĐ
                    </Typography>
                  </Box>
                </Box>
                <Box
                  sx={{
                    mt: 2,
                    pt: 2,
                    borderTop: '1px solid',
                    borderColor: 'divider',
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    Kỳ thanh toán tiếp theo
                  </Typography>
                  <Typography variant="body1" fontWeight={500}>
                    {studentInfo.tuition.nextPayment}
                  </Typography>
                </Box>
              </Paper>
            </Box>

            {/* Thông tin điểm danh */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Thống kê điểm danh
              </Typography>
              <Paper elevation={1} sx={{ p: 2, backgroundColor: 'grey.50' }}>
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr 1fr' },
                    gap: 2,
                  }}
                >
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Tổng buổi học
                    </Typography>
                    <Typography variant="body1" fontWeight={500}>
                      {studentInfo.attendance.totalSessions}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Có mặt
                    </Typography>
                    <Typography
                      variant="body1"
                      fontWeight={500}
                      color="success.main"
                    >
                      {studentInfo.attendance.attendedSessions}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Vắng
                    </Typography>
                    <Typography
                      variant="body1"
                      fontWeight={500}
                      color="error.main"
                    >
                      {studentInfo.attendance.absentSessions}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Tỷ lệ đi học
                    </Typography>
                    <Typography
                      variant="body1"
                      fontWeight={500}
                      color="primary"
                    >
                      {studentInfo.attendance.attendanceRate}%
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </Box>

            {/* Điểm số */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Điểm số
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {studentInfo.grades.map((grade: any, index: number) => (
                  <Paper
                    key={index}
                    elevation={1}
                    sx={{ p: 2, backgroundColor: 'grey.50' }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <Box>
                        <Typography variant="body1" fontWeight={500}>
                          {grade.subject}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {grade.note}
                        </Typography>
                      </Box>
                      <Chip
                        label={grade.grade}
                        color="primary"
                        variant="outlined"
                        sx={{ fontWeight: 600 }}
                      />
                    </Box>
                  </Paper>
                ))}
              </Box>
            </Box>

            {/* Lịch sử điểm danh gần đây */}
            <Box>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Lịch sử điểm danh gần đây
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {studentInfo.recentAttendance.map(
                  (attendance: any, index: number) => (
                    <Paper
                      key={index}
                      elevation={1}
                      sx={{ p: 2, backgroundColor: 'grey.50' }}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <Typography variant="body1" fontWeight={500}>
                          {attendance.date}
                        </Typography>
                        <Chip
                          label={attendance.status}
                          color={
                            attendance.status === 'Có mặt'
                              ? 'success'
                              : 'warning'
                          }
                          size="small"
                        />
                      </Box>
                      {attendance.note && (
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mt: 1 }}
                        >
                          Ghi chú: {attendance.note}
                        </Typography>
                      )}
                    </Paper>
                  )
                )}
              </Box>
            </Box>
          </Paper>
        </Box>
      )}
    </Container>
  );
}
