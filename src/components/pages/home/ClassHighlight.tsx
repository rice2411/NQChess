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
  Divider,
} from '@mui/material';
import {
  School as SchoolIcon,
  Group as GroupIcon,
  Schedule as ScheduleIcon,
  LocationOn as LocationIcon,
} from '@mui/icons-material';
import { ClassService } from '@/services/class.service';
import { UserService } from '@/services/user.service';
import { EUserRole } from '@/interfaces/user.interface';

interface ClassInfo {
  id: string;
  name: string;
  subject: string;
  teacher: string;
  students: number;
  schedule: string;
  location: string;
  status: string;
}

export default function ClassHighlight() {
  const [classes, setClasses] = useState<ClassInfo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      setLoading(true);

      // Fetch classes
      const allClasses = await ClassService.getClasses(1, 1000);

      // Fetch teachers để lấy tên giáo viên
      const allUsers = await UserService.getAllUsers();
      const teacherUsers = allUsers.filter(
        user => user.role === EUserRole.TEACHER
      );

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
      console.error('Error fetching classes:', error);
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
                            {classItem.location} • {classItem.students} học sinh
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
  );
}
