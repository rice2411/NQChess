'use client';

import { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper,
  Grid,
  useTheme,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { vi } from 'date-fns/locale';
import {
  Search as SearchIcon,
  PersonSearch as PersonSearchIcon,
} from '@mui/icons-material';
import { StudentService } from '@/services/student.service';
import { AttendanceService } from '@/services/attendance.service';
import { TuitionService } from '@/services/tuition.service';
import { ClassService } from '@/services/class.service';

interface SearchForm {
  fullName: string;
  dateOfBirth: Date | null;
  phoneNumber: string;
}

interface StudentInfo {
  id: string;
  fullName: string;
  dateOfBirth: string;
  phoneNumber: string;
  classInfo: any;
  tuition: any;
  attendance: any;
  recentAttendance: any[];
}

export default function SearchStudent() {
  const theme = useTheme();

  // Common input styling để đảm bảo đồng nhất
  const commonInputStyle = {
    '& .MuiOutlinedInput-root': {
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      '&:hover': {
        backgroundColor: 'rgba(255, 255, 255, 1)',
      },
      '&.Mui-focused': {
        backgroundColor: 'rgba(255, 255, 255, 1)',
      },
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: 'rgba(255, 255, 255, 0.3)',
      },
      '&:hover .MuiOutlinedInput-notchedOutline': {
        borderColor: 'rgba(255, 255, 255, 0.5)',
      },
      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
        borderColor: 'white',
      },
      '& .MuiInputBase-input': {
        '&::placeholder': {
          color: 'rgba(0, 0, 0, 0.6)',
          opacity: 1,
        },
      },
    },
    '& .MuiInputLabel-root': {
      color: 'rgba(0, 0, 0, 0.87)',
      '&.Mui-focused': {
        color: 'black',
        transform: 'translate(14px, -9px) scale(0.75)',
        top: '0px',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        padding: '0 4px',
        borderRadius: '4px',
      },
    },
  };

  // Style cho DatePicker để đảm bảo đồng nhất
  const datePickerStyle = {
    '& .MuiPickersInputBase-root': {
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      '&:hover': {
        backgroundColor: 'rgba(255, 255, 255, 1)',
      },
      '&.Mui-focused': {
        backgroundColor: 'rgba(255, 255, 255, 1)',
      },
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: 'rgba(255, 255, 255, 0.3)',
      },
      '&:hover .MuiOutlinedInput-notchedOutline': {
        borderColor: 'rgba(255, 255, 255, 0.5)',
      },
      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
        borderColor: 'white',
      },
      '& .MuiInputBase-input': {
        color: 'rgba(0, 0, 0, 0.87)',
        '&::placeholder': {
          color: 'rgba(0, 0, 0, 0.6)',
          opacity: 1,
        },
      },
      '& .MuiInputAdornment-root': {
        color: 'rgba(0, 0, 0, 0.6)',
      },
    },
    '& .MuiInputLabel-root': {
      color: 'rgba(0, 0, 0, 0.87)',
      '&.Mui-focused': {
        color: 'black',
        transform: 'translate(14px, -9px) scale(0.75)',
        top: '0px',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        padding: '0 4px',
        borderRadius: '4px',
      },
    },
  };

  const [searchForm, setSearchForm] = useState<SearchForm>({
    fullName: '',
    dateOfBirth: null,
    phoneNumber: '',
  });
  const [showStudentPopup, setShowStudentPopup] = useState(false);
  const [studentInfo, setStudentInfo] = useState<StudentInfo | null>(null);
  const [searchLoading, setSearchLoading] = useState(false);

  const handleSearchStudent = async () => {
    const { fullName, dateOfBirth, phoneNumber } = searchForm;

    // Kiểm tra đầy đủ 3 trường
    if (!fullName.trim() || !dateOfBirth || !phoneNumber.trim()) {
      alert(
        'Vui lòng nhập đầy đủ 3 thông tin: họ tên, ngày sinh và số điện thoại'
      );
      return;
    }

    setSearchLoading(true);
    try {
      // Format ngày sinh thành string DD/MM/YYYY
      const formattedDate = dateOfBirth
        ? dateOfBirth.toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
          })
        : '';

      // Sử dụng service mới để tìm kiếm hiệu quả hơn
      const student = await StudentService.searchStudentByFullInfo(
        fullName.trim(),
        phoneNumber.trim(),
        formattedDate
      );

      if (!student) {
        alert(
          'Không tìm thấy học sinh với thông tin đã nhập. Vui lòng kiểm tra lại.'
        );
        return;
      }

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
        student.id
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

  return (
    <>
      <Box sx={{ mb: 4, px: 2 }}>
        <Card
          elevation={3}
          sx={{
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
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
                      label="Họ và tên học sinh *"
                      placeholder="Nhập họ tên..."
                      value={searchForm.fullName}
                      onChange={e =>
                        setSearchForm({
                          ...searchForm,
                          fullName: e.target.value,
                        })
                      }
                      sx={commonInputStyle}
                    />
                    <LocalizationProvider
                      dateAdapter={AdapterDateFns}
                      adapterLocale={vi}
                    >
                      <DatePicker
                        label="Ngày sinh *"
                        value={searchForm.dateOfBirth}
                        onChange={newValue => {
                          setSearchForm({
                            ...searchForm,
                            dateOfBirth: newValue,
                          });
                        }}
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            sx: datePickerStyle,
                          },
                        }}
                      />
                    </LocalizationProvider>
                    <TextField
                      fullWidth
                      label="Số điện thoại *"
                      placeholder="0123456789"
                      value={searchForm.phoneNumber}
                      onChange={e =>
                        setSearchForm({
                          ...searchForm,
                          phoneNumber: e.target.value,
                        })
                      }
                      sx={commonInputStyle}
                    />
                  </Box>

                  {/* Nút tìm kiếm */}
                  <Button
                    variant="contained"
                    size="large"
                    onClick={handleSearchStudent}
                    disabled={
                      searchLoading ||
                      !searchForm.fullName.trim() ||
                      !searchForm.dateOfBirth ||
                      !searchForm.phoneNumber.trim()
                    }
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
              overflow: 'hidden',
              borderRadius: 3,
              display: 'flex',
              flexDirection: 'column',
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* Header - Fixed */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                p: 3,
                pb: 2,
                borderBottom: '1px solid',
                borderColor: 'divider',
                backgroundColor: 'background.paper',
                borderRadius: '12px 12px 0 0',
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

            {/* Content - Scrollable */}
            <Box
              sx={{
                flex: 1,
                overflow: 'auto',
                p: 3,
                pt: 2,
                '&::-webkit-scrollbar': {
                  width: '8px',
                },
                '&::-webkit-scrollbar-track': {
                  backgroundColor: 'rgba(0, 0, 0, 0.1)',
                  borderRadius: '4px',
                },
                '&::-webkit-scrollbar-thumb': {
                  backgroundColor: 'rgba(0, 0, 0, 0.3)',
                  borderRadius: '4px',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  },
                },
              }}
            >
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
                </Box>
              </Box>

              {/* Thông tin lớp học */}
              {studentInfo.classInfo && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    Thông tin lớp học
                  </Typography>
                  <Paper
                    elevation={1}
                    sx={{ p: 2, backgroundColor: 'grey.50' }}
                  >
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
                          Lịch học
                        </Typography>
                        <Typography variant="body1" fontWeight={500}>
                          {studentInfo.classInfo.schedule}
                        </Typography>
                      </Box>
                    </Box>
                  </Paper>
                </Box>
              )}

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
                        {studentInfo.tuition.remainingAmount.toLocaleString()}{' '}
                        VNĐ
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

              {/* Lịch sử điểm danh gần đây */}
              <Box>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Lịch sử điểm danh gần đây
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {studentInfo.recentAttendance.map((attendance, index) => (
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
                        <Typography variant="body2" color="text.secondary">
                          {attendance.status}
                        </Typography>
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
                  ))}
                </Box>
              </Box>
            </Box>
          </Paper>
        </Box>
      )}
    </>
  );
}
