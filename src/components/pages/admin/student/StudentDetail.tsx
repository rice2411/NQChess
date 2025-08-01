'use client';
import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Avatar,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  Grid,
  Card,
  CardContent,
  Alert,
  IconButton,
} from '@mui/material';
import {
  ArrowBack,
  School,
  Payment,
  Schedule,
  Warning,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { IStudent, EGender } from '@/interfaces/student.interface';
import { IClass, EClassStatus } from '@/interfaces/class.interface';
import { ITuitionFee, ETuitionStatus } from '@/interfaces/tuition.interface';
import {
  IAttendance,
  EAttendanceStatus,
} from '@/interfaces/attendance.interface';
import StudentService from '@/services/student.service';
import ClassService from '@/services/class.service';
import TuitionService from '@/services/tuition.service';
import AttendanceService from '@/services/attendance.service';
import { UserService } from '@/services/user.service';
import { EUserRole } from '@/interfaces/user.interface';
import { getAvatarUrl } from '@/constants/avatar';
import { useGlobalLoadingStore } from '@/store/useGlobalLoadingStore';
import Pagination from '@/components/ui/Pagination';

interface StudentDetailProps {
  studentId: string;
}

interface StudentClassInfo {
  class: IClass;
  tuition: ITuitionFee[];
  totalPaid: number;
  totalUnpaid: number;
  isLate: boolean;
}

interface StudentAttendanceInfo {
  attendance: IAttendance;
  class: IClass;
}

export default function StudentDetail({ studentId }: StudentDetailProps) {
  const router = useRouter();
  const { setLoading } = useGlobalLoadingStore();

  const [student, setStudent] = useState<IStudent | null>(null);
  const [studentClasses, setStudentClasses] = useState<StudentClassInfo[]>([]);
  const [attendances, setAttendances] = useState<StudentAttendanceInfo[]>([]);
  const [teachers, setTeachers] = useState<
    Array<{ id: string; fullName: string }>
  >([]);
  const [selectedClass, setSelectedClass] = useState<IClass | null>(null);
  const [attendancePage, setAttendancePage] = useState(1);
  const [attendanceTotal, setAttendanceTotal] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && studentId) {
      fetchStudentDetail();
    }
  }, [mounted, studentId]);

  // Lấy danh sách giáo viên
  async function fetchTeachers() {
    try {
      const allUsers = await UserService.getAllUsers();
      const teacherUsers = allUsers.filter(
        user => user.role === EUserRole.TEACHER
      );
      setTeachers(
        teacherUsers.map(user => ({ id: user.id, fullName: user.fullName }))
      );
    } catch (error) {
      console.error('Lỗi khi lấy danh sách giáo viên:', error);
    }
  }

  // Lấy tên giáo viên theo ID
  function getTeacherName(teacherId: string): string {
    const teacher = teachers.find(t => t.id === teacherId);
    return teacher ? teacher.fullName : 'Chưa phân công';
  }

  async function fetchStudentDetail() {
    try {
      setLoading(true);

      // Fetch thông tin học sinh
      const studentData = await StudentService.getStudentById(studentId);
      if (!studentData) {
        throw new Error('Không tìm thấy học sinh');
      }
      setStudent(studentData);

      // Fetch danh sách giáo viên
      await fetchTeachers();

      // Fetch các lớp học của học sinh
      const classes = await ClassService.getClassesByStudent(studentId);

      // Fetch thông tin học phí cho từng lớp
      const studentClassesData: StudentClassInfo[] = [];
      for (const cls of classes) {
        const tuitions = await TuitionService.getTuitionsByStudentAndClass(
          studentId,
          cls.id
        );

        const totalPaid = tuitions
          .filter(t => t.status === ETuitionStatus.PAID)
          .reduce((sum, t) => sum + t.amount, 0);

        const totalUnpaid = tuitions
          .filter(t => t.status === ETuitionStatus.PENDING)
          .reduce((sum, t) => sum + t.amount, 0);

        // Kiểm tra trễ học phí (tháng hiện tại và quá khứ chưa đóng)
        const currentMonth = new Date().getMonth() + 1;
        const currentYear = new Date().getFullYear();
        const isLate = tuitions.some(t => {
          const tuitionDate = new Date(t.month);
          const tuitionMonth = tuitionDate.getMonth() + 1;
          const tuitionYear = tuitionDate.getFullYear();
          return (
            t.status === ETuitionStatus.PENDING &&
            (tuitionYear < currentYear ||
              (tuitionYear === currentYear && tuitionMonth <= currentMonth))
          );
        });

        studentClassesData.push({
          class: cls,
          tuition: tuitions,
          totalPaid,
          totalUnpaid,
          isLate,
        });
      }

      setStudentClasses(studentClassesData);

      // Fetch điểm danh nếu có lớp được chọn
      if (selectedClass) {
        await fetchAttendances();
      }
    } catch (error) {
      console.error('Error fetching student detail:', error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchAttendances() {
    if (!selectedClass || !studentId) return;

    try {
      setLoading(true);
      const attendancesData =
        await AttendanceService.getAttendancesByStudentAndClass(
          studentId,
          selectedClass.id,
          attendancePage,
          10
        );

      // Fetch thông tin lớp cho mỗi buổi điểm danh
      const attendanceInfos: StudentAttendanceInfo[] = [];
      for (const attendance of attendancesData.attendances) {
        const classInfo = await ClassService.getClassById(attendance.classId);
        if (classInfo) {
          attendanceInfos.push({
            attendance,
            class: classInfo,
          });
        }
      }

      setAttendances(attendanceInfos);
      setAttendanceTotal(attendancesData.total);
    } catch (error) {
      console.error('Error fetching attendances:', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (selectedClass) {
      fetchAttendances();
    }
  }, [selectedClass, attendancePage]);

  function handleBack() {
    router.back();
  }

  function handleClassSelect(cls: IClass) {
    setSelectedClass(cls);
    setAttendancePage(1);
  }

  function getClassStatus(status: EClassStatus): string {
    switch (status) {
      case EClassStatus.ACTIVE:
        return 'Đang học';
      case EClassStatus.NOT_STARTED:
        return 'Chưa bắt đầu';
      case EClassStatus.ENDED:
        return 'Đã kết thúc';
      default:
        return 'Không xác định';
    }
  }

  function getClassStatusColor(
    status: EClassStatus
  ): 'success' | 'warning' | 'default' {
    switch (status) {
      case EClassStatus.ACTIVE:
        return 'success';
      case EClassStatus.NOT_STARTED:
        return 'warning';
      case EClassStatus.ENDED:
        return 'default';
      default:
        return 'default';
    }
  }

  if (!mounted) {
    return (
      <Container maxWidth={false} sx={{ mt: 4, mx: 0, width: '100%' }}>
        <Typography>Đang tải...</Typography>
      </Container>
    );
  }

  if (!student) {
    return (
      <Container maxWidth={false} sx={{ mt: 4, mx: 0, width: '100%' }}>
        <Typography>Không tìm thấy học sinh</Typography>
      </Container>
    );
  }

  const totalLateAmount = studentClasses
    .filter(sc => sc.isLate)
    .reduce((sum, sc) => sum + sc.totalUnpaid, 0);

  return (
    <Container maxWidth={false} sx={{ mt: 4, mx: 0, width: '100%' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <IconButton onClick={handleBack}>
          <ArrowBack />
        </IconButton>
        <Typography variant="h4" fontWeight={700} color="primary">
          Hồ sơ học sinh
        </Typography>
      </Box>

      {/* Thông tin chung học sinh */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          <Avatar
            src={getAvatarUrl(
              student.gender,
              student.fullName.replace(/\s+/g, '')
            )}
            alt={student.fullName}
            sx={{ width: 80, height: 80, fontSize: 32 }}
            onError={e => {
              // Fallback to text avatar if image fails to load
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              const avatarElement = target.parentElement;
              if (avatarElement) {
                avatarElement.style.display = 'flex';
              }
            }}
          >
            {student.fullName?.charAt(0) || '?'}
          </Avatar>
          <Box>
            <Typography variant="h5" fontWeight={600} mb={1}>
              {student.fullName}
            </Typography>
            <Typography color="text.secondary" mb={1}>
              Số điện thoại: {student.phoneNumber}
            </Typography>
            <Typography color="text.secondary" mb={1}>
              Ngày sinh:{' '}
              {student.dateOfBirth
                ? new Date(student.dateOfBirth).toLocaleDateString('vi-VN')
                : 'N/A'}
            </Typography>
            <Typography color="text.secondary">
              Giới tính: {student.gender === EGender.MALE ? 'Nam' : 'Nữ'}
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* Thông tin học phí */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography
          variant="h6"
          fontWeight={600}
          mb={2}
          sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
        >
          <Payment />
          Thông tin học phí
        </Typography>

        {totalLateAmount > 0 && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            <Typography fontWeight={600}>
              Tổng học phí trễ: {totalLateAmount.toLocaleString()} đ
            </Typography>
          </Alert>
        )}

        {studentClasses.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography color="text.secondary" variant="body1">
              Chưa có thông tin học phí nào cho học sinh này.
            </Typography>
            <Typography color="text.secondary" variant="body2" sx={{ mt: 1 }}>
              Học sinh chưa tham gia lớp học nào hoặc chưa có dữ liệu học phí.
            </Typography>
          </Box>
        ) : (
          <Box>
            {/* Tổng quan học phí */}
            <Typography variant="subtitle1" fontWeight={600} mb={2}>
              Tổng quan học phí
            </Typography>
            <TableContainer sx={{ mb: 3 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Tên lớp</TableCell>
                    <TableCell>Giáo viên đảm nhiệm</TableCell>
                    <TableCell>Trạng thái</TableCell>
                    <TableCell>Đã đóng</TableCell>
                    <TableCell>Chưa đóng</TableCell>
                    <TableCell>Tình trạng</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {studentClasses.map(studentClass => (
                    <TableRow key={studentClass.class.id}>
                      <TableCell>
                        <Typography fontWeight={600}>
                          {studentClass.class.name}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography color="text.secondary">
                          {getTeacherName(studentClass.class.teacherId)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={getClassStatus(studentClass.class.status)}
                          color={getClassStatusColor(studentClass.class.status)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography color="success.main" fontWeight={600}>
                          {studentClass.totalPaid.toLocaleString()} đ
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography color="error.main" fontWeight={600}>
                          {studentClass.totalUnpaid.toLocaleString()} đ
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {studentClass.isLate ? (
                          <Chip
                            label="Trễ học phí"
                            color="error"
                            size="small"
                            icon={<Warning />}
                          />
                        ) : (
                          <Chip label="Đúng hạn" color="success" size="small" />
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Chi tiết học phí theo từng tháng */}
            <Typography variant="subtitle1" fontWeight={600} mb={2}>
              Chi tiết học phí theo từng tháng
            </Typography>

            {studentClasses.map(studentClass => (
              <Card key={studentClass.class.id} sx={{ mb: 2 }}>
                <CardContent>
                  <Typography
                    variant="h6"
                    fontWeight={600}
                    mb={2}
                    color="primary"
                  >
                    {studentClass.class.name}
                  </Typography>

                  <Typography variant="body2" color="text.secondary" mb={2}>
                    Giáo viên đảm nhiệm:{' '}
                    {getTeacherName(studentClass.class.teacherId)}
                  </Typography>

                  {studentClass.tuition.length === 0 ? (
                    <Typography
                      color="text.secondary"
                      sx={{ fontStyle: 'italic' }}
                    >
                      Chưa có dữ liệu học phí cho lớp này
                    </Typography>
                  ) : (
                    <TableContainer>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Tháng</TableCell>
                            <TableCell>Số tiền</TableCell>
                            <TableCell>Trạng thái</TableCell>
                            <TableCell>Ngày đóng</TableCell>
                            <TableCell>Ghi chú</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {studentClass.tuition
                            .sort(
                              (a, b) =>
                                new Date(b.month).getTime() -
                                new Date(a.month).getTime()
                            )
                            .map(tuition => (
                              <TableRow key={tuition.id}>
                                <TableCell>
                                  <Typography fontWeight={500}>
                                    {new Date(tuition.month).toLocaleDateString(
                                      'vi-VN',
                                      {
                                        month: 'long',
                                        year: 'numeric',
                                      }
                                    )}
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography fontWeight={600}>
                                    {tuition.amount.toLocaleString()} đ
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  <Chip
                                    label={
                                      tuition.status === ETuitionStatus.PAID
                                        ? 'Đã đóng'
                                        : 'Chưa đóng'
                                    }
                                    color={
                                      tuition.status === ETuitionStatus.PAID
                                        ? 'success'
                                        : 'error'
                                    }
                                    size="small"
                                  />
                                </TableCell>
                                <TableCell>
                                  {tuition.paidDate
                                    ? new Date(
                                        tuition.paidDate
                                      ).toLocaleDateString('vi-VN')
                                    : '-'}
                                </TableCell>
                                <TableCell>{tuition.note || '-'}</TableCell>
                              </TableRow>
                            ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  )}
                </CardContent>
              </Card>
            ))}
          </Box>
        )}
      </Paper>

      {/* Danh sách lớp học */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography
          variant="h6"
          fontWeight={600}
          mb={2}
          sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
        >
          <School />
          Danh sách lớp học đang tham gia
        </Typography>

        {studentClasses.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography color="text.secondary" variant="body1">
              Học sinh chưa tham gia lớp học nào.
            </Typography>
            <Typography color="text.secondary" variant="body2" sx={{ mt: 1 }}>
              Vui lòng thêm học sinh vào lớp học để xem thông tin chi tiết.
            </Typography>
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Tên lớp</TableCell>
                  <TableCell>Lịch học</TableCell>
                  <TableCell>Ngày bắt đầu</TableCell>
                  <TableCell>Ngày kết thúc</TableCell>
                  <TableCell>Trạng thái</TableCell>
                  <TableCell>Tổng thiếu</TableCell>
                  <TableCell>Hành động</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {studentClasses.map(studentClass => (
                  <TableRow key={studentClass.class.id}>
                    <TableCell>
                      <Typography fontWeight={600}>
                        {studentClass.class.name}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {studentClass.class.schedules?.map((schedule, idx) => (
                        <Chip
                          key={idx}
                          label={schedule}
                          size="small"
                          sx={{ mr: 0.5, mb: 0.5 }}
                        />
                      ))}
                    </TableCell>
                    <TableCell>
                      {studentClass.class.startDate
                        ? new Date(
                            studentClass.class.startDate
                          ).toLocaleDateString('vi-VN')
                        : '-'}
                    </TableCell>
                    <TableCell>
                      {studentClass.class.endDate
                        ? new Date(
                            studentClass.class.endDate
                          ).toLocaleDateString('vi-VN')
                        : '-'}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={getClassStatus(studentClass.class.status)}
                        color={getClassStatusColor(studentClass.class.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography color="error.main" fontWeight={600}>
                        {studentClass.totalUnpaid.toLocaleString()} đ
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => handleClassSelect(studentClass.class)}
                      >
                        Xem chi tiết
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      {/* Chi tiết lớp học được chọn */}
      {selectedClass && (
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography
            variant="h6"
            fontWeight={600}
            mb={2}
            sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
          >
            <Schedule />
            Chi tiết lớp: {selectedClass.name}
          </Typography>

          {/* Thông tin chung lớp học */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Grid container spacing={2}>
                <Grid sx={{ xs: 12, md: 6 }}>
                  <Typography variant="subtitle1" fontWeight={600}>
                    Thông tin chung
                  </Typography>
                  <Typography>Tên lớp: {selectedClass.name}</Typography>
                  <Typography>
                    Lịch học: {selectedClass.schedules?.join(', ')}
                  </Typography>
                  <Typography>
                    Ngày bắt đầu:{' '}
                    {selectedClass.startDate
                      ? new Date(selectedClass.startDate).toLocaleDateString(
                          'vi-VN'
                        )
                      : 'N/A'}
                  </Typography>
                  <Typography>
                    Ngày kết thúc:{' '}
                    {selectedClass.endDate
                      ? new Date(selectedClass.endDate).toLocaleDateString(
                          'vi-VN'
                        )
                      : 'N/A'}
                  </Typography>
                </Grid>
                <Grid sx={{ xs: 12, md: 6 }}>
                  <Typography variant="subtitle1" fontWeight={600}>
                    Tình hình học phí
                  </Typography>
                  {(() => {
                    const classInfo = studentClasses.find(
                      sc => sc.class.id === selectedClass.id
                    );
                    if (classInfo) {
                      return (
                        <>
                          <Typography color="success.main">
                            Đã đóng: {classInfo.totalPaid.toLocaleString()} đ
                          </Typography>
                          <Typography color="error.main">
                            Chưa đóng: {classInfo.totalUnpaid.toLocaleString()}{' '}
                            đ
                          </Typography>
                        </>
                      );
                    }
                    return <Typography>Không có thông tin học phí</Typography>;
                  })()}
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Danh sách buổi học */}
          <Typography variant="subtitle1" fontWeight={600} mb={2}>
            Danh sách buổi học
          </Typography>

          {attendances.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography color="text.secondary" variant="body1">
                Chưa có dữ liệu điểm danh cho học sinh này.
              </Typography>
              <Typography color="text.secondary" variant="body2" sx={{ mt: 1 }}>
                Dữ liệu điểm danh sẽ được hiển thị khi có buổi học được ghi
                nhận.
              </Typography>
            </Box>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Ngày học</TableCell>
                    <TableCell>Điểm danh</TableCell>
                    <TableCell>Ghi chú</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {attendances.map(attendanceInfo => (
                    <TableRow key={attendanceInfo.attendance.id}>
                      <TableCell>
                        {attendanceInfo.attendance.sessionDate
                          ? new Date(
                              attendanceInfo.attendance.sessionDate
                            ).toLocaleDateString('vi-VN')
                          : '-'}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={
                            attendanceInfo.attendance.attendanceRecords?.[0]
                              ?.status === EAttendanceStatus.PRESENT
                              ? 'Có mặt'
                              : 'Vắng'
                          }
                          color={
                            attendanceInfo.attendance.attendanceRecords?.[0]
                              ?.status === EAttendanceStatus.PRESENT
                              ? 'success'
                              : 'error'
                          }
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        {attendanceInfo.attendance.attendanceRecords?.[0]
                          ?.note ||
                          attendanceInfo.attendance.notes ||
                          '-'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {/* Pagination cho điểm danh */}
          {attendanceTotal > 0 && (
            <Pagination
              currentPage={attendancePage}
              totalItems={attendanceTotal}
              itemsPerPage={10}
              currentItems={attendances.length}
              hasMore={attendances.length < attendanceTotal}
              loading={false}
              onPageChange={setAttendancePage}
              showLoadMore={false}
              infoText={`Hiển thị ${attendances.length} / ${attendanceTotal} buổi học`}
              loadingText="Đang tải..."
            />
          )}
        </Paper>
      )}
    </Container>
  );
}
