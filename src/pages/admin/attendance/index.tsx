'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Box,
  CircularProgress,
} from '@mui/material';
import {
  CalendarMonth,
  People,
  AccessTime,
  CheckCircle,
  School,
} from '@mui/icons-material';
import { ClassService } from '@/services/class.service';
import { AttendanceService } from '@/services/attendance.service';
import { IClass } from '@/interfaces/class.interface';
import { IAttendance } from '@/interfaces/attendance.interface';
import AttendanceModal from './Modal/AttendanceModal';

export default function AttendancesManagement() {
  const [classes, setClasses] = useState<IClass[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<string>('');
  const [selectedClass, setSelectedClass] = useState<IClass | null>(null);
  const [attendanceSessions, setAttendanceSessions] = useState<IAttendance[]>(
    []
  );
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedSession, setSelectedSession] = useState<IAttendance | null>(
    null
  );
  // Load danh sách lớp học
  useEffect(() => {
    loadClasses();
  }, []);

  // Load buổi điểm danh khi chọn lớp
  useEffect(() => {
    if (selectedClassId) {
      loadAttendanceSessions();
    }
  }, [selectedClassId]);

  const loadClasses = async () => {
    try {
      setLoading(true);
      const result = await ClassService.getClasses(1, 1000);
      setClasses(result.classes);
    } catch (error) {
      console.error('Lỗi khi tải danh sách lớp học:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadAttendanceSessions = async () => {
    if (!selectedClassId) return;

    try {
      setLoading(true);

      // Gọi API lấy chi tiết lớp học
      const classDetail = await ClassService.getClassById(selectedClassId);
      setSelectedClass(classDetail);

      // Lấy danh sách buổi điểm danh
      const result = await AttendanceService.getAttendanceByClass(
        selectedClassId,
        1,
        1000
      );

      // Filter buổi điểm danh dựa trên học sinh thực sự học buổi đó
      const filteredSessions = result.attendance.filter(session => {
        // Kiểm tra xem có học sinh nào học buổi này không
        const hasStudentsInSession = session.attendanceRecords.some(record => {
          const student = classDetail?.students.find(
            s => s.studentId === record.studentId
          );
          if (!student) return false;

          // Nếu học sinh học nửa buổi, chỉ hiển thị trong buổi học cụ thể
          if (student.type === 'HALF' && student.session) {
            return student.session === session.sessionNumber.toString();
          }

          // Học sinh học full được hiển thị trong tất cả buổi học
          return true;
        });

        return hasStudentsInSession;
      });

      setAttendanceSessions(filteredSessions);
    } catch (error) {
      console.error('Lỗi khi tải buổi điểm danh:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClassChange = (classId: string) => {
    setSelectedClassId(classId);
    setSelectedSession(null);
  };

  const handleSessionClick = (session: IAttendance) => {
    setSelectedSession(session);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setSelectedSession(null);
  };

  const handleAttendanceUpdate = async () => {
    // Reload buổi điểm danh sau khi cập nhật
    await loadAttendanceSessions();
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('vi-VN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (timeStr: string) => {
    return timeStr; // Giữ nguyên format "HH:mm - HH:mm"
  };
  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Quản lý điểm danh
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Chọn lớp học để xem và quản lý điểm danh
        </Typography>
      </Box>

      {/* Chọn lớp học */}
      <Card sx={{ mb: 3 }}>
        <CardHeader
          title={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <School />
              <Typography variant="h6">Chọn lớp học</Typography>
            </Box>
          }
        />
        <CardContent>
          <FormControl sx={{ minWidth: 300 }}>
            <InputLabel>Lớp học</InputLabel>
            <Select
              value={selectedClassId}
              label="Lớp học"
              onChange={e => handleClassChange(e.target.value)}
            >
              {classes.map(classItem => (
                <MenuItem key={classItem.id} value={classItem.id}>
                  {classItem.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </CardContent>
      </Card>

      {/* Thông tin lớp học được chọn */}
      {selectedClass && (
        <Card sx={{ mb: 3 }}>
          <CardHeader
            title={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <People />
                <Typography variant="h6">Thông tin lớp học</Typography>
              </Box>
            }
          />
          <CardContent>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
                gap: 3,
              }}
            >
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Tên lớp
                </Typography>
                <Typography variant="h6" fontWeight="bold">
                  {selectedClass.name}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Số học sinh
                </Typography>
                <Typography variant="h6" fontWeight="bold">
                  {selectedClass.students?.length || 0}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Trạng thái
                </Typography>
                <Chip
                  label={
                    selectedClass.status === 'ACTIVE'
                      ? 'Đang hoạt động'
                      : 'Không hoạt động'
                  }
                  color={
                    selectedClass.status === 'ACTIVE' ? 'success' : 'default'
                  }
                  size="small"
                />
              </Box>
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Danh sách buổi điểm danh */}
      {selectedClassId && (
        <Card>
          <CardHeader
            title={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CalendarMonth />
                <Typography variant="h6">Danh sách buổi điểm danh</Typography>
              </Box>
            }
          />
          <CardContent>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress />
              </Box>
            ) : attendanceSessions.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <CalendarMonth
                  sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }}
                />
                <Typography color="text.secondary">
                  Chưa có buổi điểm danh nào
                </Typography>
              </Box>
            ) : (
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: {
                    xs: '1fr',
                    md: 'repeat(2, 1fr)',
                    lg: 'repeat(3, 1fr)',
                  },
                  gap: 3,
                }}
              >
                {attendanceSessions.map(session => (
                  <Card
                    key={session.id}
                    sx={{
                      cursor: 'pointer',
                      '&:hover': { boxShadow: 3 },
                      transition: 'box-shadow 0.2s',
                    }}
                    onClick={() => handleSessionClick(session)}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          mb: 2,
                        }}
                      >
                        <Chip
                          label={`Buổi ${session.sessionNumber}`}
                          variant="outlined"
                          size="small"
                        />
                        <Box
                          sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                        >
                          <CheckCircle
                            sx={{ color: 'success.main', fontSize: 16 }}
                          />
                          <Typography variant="body2" color="text.secondary">
                            {(() => {
                              // Dữ liệu đã được filter từ khi tạo buổi điểm danh
                              const actualStudents = session.attendanceRecords;
                              const presentCount = actualStudents.filter(
                                r => r.status === 'PRESENT'
                              ).length;
                              return `${presentCount}/${actualStudents.length}`;
                            })()}
                          </Typography>
                        </Box>
                      </Box>

                      <Box sx={{ mb: 2 }}>
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            mb: 1,
                          }}
                        >
                          <CalendarMonth
                            sx={{ fontSize: 16, color: 'text.secondary' }}
                          />
                          <Typography variant="body2" fontWeight="medium">
                            {formatDate(session.sessionDate)}
                          </Typography>
                        </Box>

                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            mb: 1,
                          }}
                        >
                          <AccessTime
                            sx={{ fontSize: 16, color: 'text.secondary' }}
                          />
                          <Typography variant="body2" color="text.secondary">
                            {formatTime(session.sessionTime)}
                          </Typography>
                        </Box>

                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            mb: 2,
                          }}
                        >
                          <People
                            sx={{ fontSize: 16, color: 'text.secondary' }}
                          />
                          <Typography variant="body2" color="text.secondary">
                            {session.attendanceRecords.length} học sinh
                          </Typography>
                        </Box>
                      </Box>

                      <Box sx={{ pt: 2, borderTop: 1, borderColor: 'divider' }}>
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                          }}
                        >
                          {(() => {
                            const presentCount =
                              session.attendanceRecords.filter(
                                r => r.status === 'PRESENT'
                              ).length;
                            const absentCount =
                              session.attendanceRecords.filter(
                                r => r.status === 'ABSENT'
                              ).length;
                            const lateCount = session.attendanceRecords.filter(
                              r => r.status === 'LATE'
                            ).length;

                            return (
                              <>
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                >
                                  Có mặt: {presentCount}
                                </Typography>
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                >
                                  Vắng: {absentCount}
                                </Typography>
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                >
                                  Muộn: {lateCount}
                                </Typography>
                              </>
                            );
                          })()}
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            )}
          </CardContent>
        </Card>
      )}

      {/* Modal điểm danh */}
      {showModal && selectedSession && (
        <AttendanceModal
          session={selectedSession}
          classData={selectedClass}
          onClose={handleModalClose}
          onUpdate={handleAttendanceUpdate}
        />
      )}
    </Box>
  );
}
