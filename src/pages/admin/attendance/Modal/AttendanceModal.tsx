'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  Button,
  Card,
  CardContent,
  Box,
  Typography,
  Grid,
  Switch,
  FormControlLabel,
  TextField,
  Collapse,
  Chip,
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
  ExpandMore,
  ExpandLess,
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
  const [saving, setSaving] = useState(false);
  const [expandedStudents, setExpandedStudents] = useState<Set<string>>(
    new Set()
  );

  useEffect(() => {
    if (session && classData) {
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

  const handleNoteChange = (studentId: string, note: string) => {
    setAttendanceRecords(prev =>
      prev.map(record =>
        record.studentId === studentId ? { ...record, note } : record
      )
    );
  };

  const toggleStudentExpanded = (studentId: string) => {
    setExpandedStudents(prev => {
      const newSet = new Set(prev);
      if (newSet.has(studentId)) {
        newSet.delete(studentId);
      } else {
        newSet.add(studentId);
      }
      return newSet;
    });
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

  const getSessionDisplayText = (studentSession?: string) => {
    if (!studentSession) return null;

    // Xử lý các trường hợp khác nhau của studentSession
    if (studentSession.includes('full') || studentSession.includes('Full')) {
      return 'Full buổi học';
    }
    if (
      studentSession.includes('half') ||
      studentSession.includes('Half') ||
      studentSession.includes('nửa')
    ) {
      return 'Nửa buổi học';
    }
    if (studentSession.includes('session')) {
      return `Buổi ${studentSession.replace('session-', '')}`;
    }

    // Trường hợp khác, hiển thị nguyên gốc
    return studentSession;
  };

  return (
    <Dialog
      open={true}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          maxHeight: '90vh',
        },
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
                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                                mt: 0.5,
                              }}
                            >
                              {getSessionDisplayText(record.studentSession) ? (
                                <Chip
                                  label={getSessionDisplayText(
                                    record.studentSession
                                  )}
                                  size="small"
                                  color="primary"
                                  variant="outlined"
                                />
                              ) : (
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                >
                                  Học đầy đủ
                                </Typography>
                              )}
                            </Box>
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

                        {/* Nút mở rộng để thêm ghi chú */}
                        <Button
                          size="small"
                          onClick={() =>
                            toggleStudentExpanded(record.studentId)
                          }
                          sx={{ minWidth: 'auto', p: 1 }}
                        >
                          {expandedStudents.has(record.studentId) ? (
                            <ExpandLess />
                          ) : (
                            <ExpandMore />
                          )}
                        </Button>
                      </Box>
                    </Box>

                    {/* Phần ghi chú có thể mở rộng */}
                    <Collapse in={expandedStudents.has(record.studentId)}>
                      <Box
                        sx={{
                          mt: 2,
                          pt: 2,
                          borderTop: 1,
                          borderColor: 'divider',
                        }}
                      >
                        <Box
                          sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 2,
                          }}
                        >
                          <TextField
                            fullWidth
                            multiline
                            rows={4}
                            label="Đánh giá chi tiết học sinh"
                            placeholder="Nhập đánh giá về: thái độ học tập, mức độ hiểu bài, bài tập về nhà, góp ý..."
                            value={record.note || ''}
                            onChange={e =>
                              handleNoteChange(record.studentId, e.target.value)
                            }
                            variant="outlined"
                            size="small"
                            helperText="Ghi chú về thái độ, hiểu bài, bài tập về nhà và các góp ý khác"
                          />

                          {/* Hiển thị thống kê nhanh về ghi chú */}
                          {record.note && (
                            <Box
                              sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}
                            >
                              <Chip
                                label={`${record.note.length} ký tự`}
                                size="small"
                                color="info"
                                variant="outlined"
                              />
                              {record.note.length > 100 && (
                                <Chip
                                  label="Đánh giá chi tiết"
                                  size="small"
                                  color="success"
                                  variant="outlined"
                                />
                              )}
                            </Box>
                          )}
                        </Box>
                      </Box>
                    </Collapse>

                    {/* Hiển thị ghi chú đã có (nếu không mở rộng) */}
                    {record.note && !expandedStudents.has(record.studentId) && (
                      <Box
                        sx={{
                          mt: 2,
                          pt: 2,
                          borderTop: 1,
                          borderColor: 'divider',
                        }}
                      >
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            mb: 1,
                          }}
                        >
                          <Typography
                            variant="body2"
                            fontWeight="medium"
                            color="primary"
                          >
                            Đánh giá học sinh:
                          </Typography>
                          <Chip
                            label={`${record.note.length} ký tự`}
                            size="small"
                            color="info"
                            variant="outlined"
                          />
                          {record.note.length > 100 && (
                            <Chip
                              label="Chi tiết"
                              size="small"
                              color="success"
                              variant="outlined"
                            />
                          )}
                        </Box>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          {record.note}
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
