'use client';

import { useEffect, useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Chip,
  Divider,
} from '@mui/material';
import { Person as PersonIcon } from '@mui/icons-material';
import { UserService } from '@/services/user.service';
import { ClassService } from '@/services/class.service';
import { EUserRole } from '@/interfaces/user.interface';

interface Teacher {
  id: string;
  name: string;
  avatar: string;
  subject: string;
  experience: string;
  rating: number;
  students: number;
}

export default function TeacherHighlight() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      setLoading(true);

      // Fetch teachers từ bảng users
      const allUsers = await UserService.getAllUsers();
      const teacherUsers = allUsers.filter(
        user => user.role === EUserRole.TEACHER
      );

      // Fetch classes để tính toán thống kê
      const allClasses = await ClassService.getClasses(1, 1000);

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
    } catch (error) {
      console.error('Error fetching teachers:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        width: { xs: '100%', md: '25%' },
        minWidth: { md: 280 },
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
                            {teacher.experience} • {teacher.students} học sinh
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
  );
}
