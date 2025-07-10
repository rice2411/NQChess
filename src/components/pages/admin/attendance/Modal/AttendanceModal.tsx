'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Button,
  Chip,
  Card,
  CardContent,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  Grid,
  Switch,
  FormControlLabel,
  Divider,
  Alert,
} from '@mui/material';
import {
  CheckCircle,
  Cancel,
  Warning,
  AccessTime,
  Person,
  CalendarMonth,
  Save,
  Close,
} from '@mui/icons-material';
import { AttendanceService } from '@/services/attendance.service';
import {
  IAttendance,
  IAttendanceRecord,
  EAttendanceStatus,
} from '@/interfaces/attendance.interface';
import { IClass } from '@/interfaces/class.interface';

interface AttendanceModalProps {
  session: IAttendance;
  classData: IClass | null;
  onClose: () => void;
  onUpdate: () => void;
}

export default function AttendanceModal({
  session,
  classData,
  onClose,
  onUpdate,
}: AttendanceModalProps) {
  const [attendanceRecords, setAttendanceRecords] = useState<
    IAttendanceRecord[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (session && classData) {
      // Dữ liệu đã được filter từ khi tạo buổi điểm danh
      // Không cần filter lại ở đây
      setAttendanceRecords(session.attendanceRecords);
    }
  }, [session, classData]);

  const handleStatusToggle = (studentId: string) => {
    setAttendanceRecords(prev =>
      prev.map(record =>
        record.studentId === studentId
          ? {
              ...record,
              status:
                record.status === EAttendanceStatus.PRESENT
                  ? EAttendanceStatus.ABSENT
                  : EAttendanceStatus.PRESENT,
            }
          : record
      )
    );
  };

  const handleSaveAll = async () => {
    setSaving(true);
    try {
      // Lưu từng record một cách tuần tự
      for (const record of attendanceRecords) {
        await AttendanceService.updateStudentAttendance(
          session.id,
          record.studentId,
          record.status,
          record.note
        );
      }
      onUpdate();
      onClose();
    } catch (error) {
      console.error('Lỗi khi lưu điểm danh:', error);
    } finally {
      setSaving(false);
    }
  };

  const getStatusIcon = (status: EAttendanceStatus) => {
    switch (status) {
      case EAttendanceStatus.PRESENT:
        return <CheckCircle sx={{ color: 'success.main', fontSize: 16 }} />;
      case EAttendanceStatus.ABSENT:
        return <Cancel sx={{ color: 'error.main', fontSize: 16 }} />;
      case EAttendanceStatus.LATE:
        return <Warning sx={{ color: 'warning.main', fontSize: 16 }} />;
      case EAttendanceStatus.EXCUSED:
        return <Warning sx={{ color: 'info.main', fontSize: 16 }} />;
      default:
        return <AccessTime sx={{ color: 'text.secondary', fontSize: 16 }} />;
    }
  };

  const getStatusText = (status: EAttendanceStatus) => {
    switch (status) {
      case EAttendanceStatus.PRESENT:
        return 'Có mặt';
      case EAttendanceStatus.ABSENT:
        return 'Vắng mặt';
      case EAttendanceStatus.LATE:
        return 'Đi muộn';
      case EAttendanceStatus.EXCUSED:
        return 'Có phép';
      default:
        return 'Chưa điểm danh';
    }
  };

  const getStatusColor = (status: EAttendanceStatus) => {
    switch (status) {
      case EAttendanceStatus.PRESENT:
        return 'success';
      case EAttendanceStatus.ABSENT:
        return 'error';
      case EAttendanceStatus.LATE:
        return 'warning';
      case EAttendanceStatus.EXCUSED:
        return 'info';
      default:
        return 'default';
    }
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
    return timeStr;
  };

  return (
    <Dialog
      open={true}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: { maxHeight: '90vh' },
      }}
    >
      <DialogContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <CalendarMonth />
          <Typography variant="h6">
            Điểm danh - Buổi {session.sessionNumber}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Thông tin buổi học */}
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Grid container spacing={3}>
                <Grid sx={{ xs: 12, md: 4 }}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Ngày học
                    </Typography>
                    <Typography variant="h6" fontWeight="bold">
                      {formatDate(session.sessionDate)}
                    </Typography>
                  </Box>
                </Grid>
                <Grid sx={{ xs: 12, md: 4 }}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Thời gian
                    </Typography>
                    <Typography variant="h6" fontWeight="bold">
                      {formatTime(session.sessionTime)}
                    </Typography>
                  </Box>
                </Grid>
                <Grid sx={{ xs: 12, md: 4 }}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Lớp học
                    </Typography>
                    <Typography variant="h6" fontWeight="bold">
                      {session.className}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Thống kê nhanh */}
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Grid container spacing={3}>
                <Grid sx={{ xs: 6, md: 3 }}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography
                      variant="h4"
                      color="success.main"
                      fontWeight="bold"
                    >
                      {
                        attendanceRecords.filter(
                          r => r.status === EAttendanceStatus.PRESENT
                        ).length
                      }
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Có mặt
                    </Typography>
                  </Box>
                </Grid>
                <Grid sx={{ xs: 6, md: 3 }}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography
                      variant="h4"
                      color="error.main"
                      fontWeight="bold"
                    >
                      {
                        attendanceRecords.filter(
                          r => r.status === EAttendanceStatus.ABSENT
                        ).length
                      }
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Vắng mặt
                    </Typography>
                  </Box>
                </Grid>
                <Grid sx={{ xs: 6, md: 3 }}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography
                      variant="h4"
                      color="warning.main"
                      fontWeight="bold"
                    >
                      {
                        attendanceRecords.filter(
                          r => r.status === EAttendanceStatus.LATE
                        ).length
                      }
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Đi muộn
                    </Typography>
                  </Box>
                </Grid>
                <Grid sx={{ xs: 6, md: 3 }}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography
                      variant="h4"
                      color="info.main"
                      fontWeight="bold"
                    >
                      {
                        attendanceRecords.filter(
                          r => r.status === EAttendanceStatus.EXCUSED
                        ).length
                      }
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Có phép
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Danh sách học sinh */}
          <Box>
            <Typography
              variant="h6"
              sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}
            >
              <Person />
              Danh sách học sinh ({attendanceRecords.length})
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {attendanceRecords.map(record => (
                <Card
                  key={record.studentId}
                  sx={{ '&:hover': { boxShadow: 2 } }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <Box sx={{ flex: 1 }}>
                        <Box
                          sx={{ display: 'flex', alignItems: 'center', gap: 2 }}
                        >
                          <Person sx={{ color: 'text.secondary' }} />
                          <Box>
                            <Typography variant="body1" fontWeight="medium">
                              {record.studentName}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              ID: {record.studentId}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>

                      <Box
                        sx={{ display: 'flex', alignItems: 'center', gap: 2 }}
                      >
                        {/* Toggle switch */}
                        <FormControlLabel
                          control={
                            <Switch
                              checked={
                                record.status === EAttendanceStatus.PRESENT
                              }
                              onChange={() =>
                                handleStatusToggle(record.studentId)
                              }
                              color="success"
                            />
                          }
                          label={
                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                                minWidth: 80,
                              }}
                            >
                              {getStatusIcon(record.status)}
                              {getStatusText(record.status)}
                            </Box>
                          }
                        />
                      </Box>
                    </Box>

                    {/* Ghi chú nếu có */}
                    {record.note && (
                      <Box
                        sx={{
                          mt: 2,
                          pt: 2,
                          borderTop: 1,
                          borderColor: 'divider',
                        }}
                      >
                        <Typography variant="body2" color="text.secondary">
                          <strong>Ghi chú:</strong> {record.note}
                        </Typography>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              ))}
            </Box>
          </Box>

          {/* Nút hành động */}
          <Box
            sx={{
              display: 'flex',
              gap: 2,
              pt: 2,
              borderTop: 1,
              borderColor: 'divider',
            }}
          >
            <Button
              onClick={handleSaveAll}
              disabled={saving}
              variant="contained"
              startIcon={<Save />}
              fullWidth
            >
              {saving ? 'Đang lưu...' : 'Lưu tất cả'}
            </Button>
            <Button
              variant="outlined"
              onClick={onClose}
              startIcon={<Close />}
              fullWidth
            >
              Đóng
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
