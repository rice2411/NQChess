'use client';

import {
  Box,
  Button,
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Snackbar,
  Avatar,
  TextField,
  InputAdornment,
  Tooltip,
} from '@mui/material';
import { Add, Edit, Delete, Search, Visibility } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import { EGender, IStudent } from '@/interfaces/student.interface';
import StudentService from '@/services/student.service';
import Pagination from '@/components/ui/Pagination';
import { usePagination } from '@/hooks/usePagination';
import { useGlobalLoadingStore } from '@/store/useGlobalLoadingStore';
import StudentFormModal from './Modal/StudentFormModal';
import { useModalConfirm } from '@/hooks/useModalConfirm';
import { useRouter } from 'next/navigation';

export default function StudentManagement() {
  const [students, setStudents] = useState<IStudent[]>([]);
  const [search, setSearch] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editing, setEditing] = useState<IStudent | null>(null);
  const [form, setForm] = useState({
    fullName: '',
    phoneNumber: '',
    dateOfBirth: '',
    avatar: '',
    gender: EGender.MALE,
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });
  const [mounted, setMounted] = useState(false);

  // Router
  const router = useRouter();

  // Pagination hook
  const {
    state: pagination,
    actions: paginationActions,
    pageSize,
  } = usePagination({
    pageSize: 10,
    initialPage: 1,
  });

  // Global loading store
  const setGlobalLoading = useGlobalLoadingStore(state => state.setLoading);

  // Confirm delete hook - chỉ sử dụng khi đã mounted
  const modalConfirm = useModalConfirm();

  // Kiểm tra mounted
  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch students
  useEffect(() => {
    if (mounted) {
      fetchStudents();
    }
  }, [mounted]);

  async function fetchStudents(searchText = '', resetPagination = true) {
    try {
      setGlobalLoading(true);

      if (resetPagination) {
        paginationActions.resetPagination();
      }

      const result = await StudentService.getStudentsWithPagination(
        pagination.currentPage,
        pageSize,
        searchText
      );

      setStudents(result.students);
      paginationActions.setHasMore(result.hasMore);
      paginationActions.setTotal(result.total);
    } catch (error) {
      console.error('Error fetching students:', error);
      setSnackbar({ open: true, message: 'Không thể tải danh sách học sinh' });
    } finally {
      setGlobalLoading(false);
    }
  }

  function handleOpenDialog(student?: IStudent) {
    setEditing(student || null);
    setForm(
      student
        ? {
            fullName: student.fullName,
            phoneNumber: student.phoneNumber,
            dateOfBirth: student.dateOfBirth,
            avatar: student.avatar,
            gender: student.gender,
          }
        : {
            fullName: '',
            phoneNumber: '',
            dateOfBirth: '',
            avatar: '',
            gender: EGender.MALE,
          }
    );
    setOpenDialog(true);
  }

  function handleCloseDialog() {
    setOpenDialog(false);
    setEditing(null);
    setForm({
      fullName: '',
      phoneNumber: '',
      dateOfBirth: '',
      avatar: '',
      gender: EGender.MALE,
    });
  }

  async function handleSave() {
    try {
      setGlobalLoading(true);

      // Chỉ refresh danh sách, không tạo/cập nhật nữa vì đã làm trong modal
      setGlobalLoading(false); // Ẩn GlobalLoading trước khi fetch lại
      fetchStudents(search, true); // Reset pagination khi thêm/sửa
      setSnackbar({
        open: true,
        message: editing ? 'Cập nhật thành công!' : 'Thêm học sinh thành công!',
      });
    } catch (error) {
      console.error('Error refreshing students:', error);
      setSnackbar({
        open: true,
        message: 'Có lỗi xảy ra khi tải danh sách học sinh',
      });
      setGlobalLoading(false); // Ẩn GlobalLoading khi có lỗi
    }
  }

  function handleDeleteClick(student: IStudent) {
    if (!mounted || !modalConfirm) return;

    modalConfirm.confirm(
      async () => {
        setGlobalLoading(true);
        await StudentService.deleteStudent(student.id);
        setSnackbar({ open: true, message: 'Đã xóa học sinh!' });
        setGlobalLoading(false); // Ẩn GlobalLoading trước khi fetch lại
        fetchStudents(search, true); // Reset pagination khi xóa
      },
      {
        message: `Bạn có chắc chắn muốn xóa học sinh ${student.fullName} không? Hành động này không thể hoàn tác.`,
      }
    );
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    fetchStudents(search, true);
  }

  function handlePageChange(page: number) {
    paginationActions.setCurrentPage(page);
    fetchStudents(search, false);
  }

  function handleFormChange(field: string, value: string | EGender) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  function handleViewDetail(student: IStudent) {
    router.push(`/students/${student.id}`);
  }

  // Không render cho đến khi mounted
  if (!mounted) {
    return (
      <Container maxWidth={false} sx={{ mt: 4, mx: 0, width: '100%' }}>
        <Typography variant="h4" fontWeight={700} color="primary" mb={3}>
          Quản lý học sinh
        </Typography>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '200px',
          }}
        >
          <Typography>Đang tải...</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth={false} sx={{ mt: 4, mx: 0, width: '100%' }}>
      <Typography variant="h4" fontWeight={700} color="primary" mb={3}>
        Quản lý học sinh
      </Typography>
      <Box
        component="form"
        onSubmit={handleSearch}
        sx={{ display: 'flex', gap: 2, mb: 2, height: '40px' }}
      >
        <TextField
          placeholder="Tìm kiếm theo tên hoặc số điện thoại..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          sx={{
            '& .MuiInputBase-root': {
              padding: '0 !important',
              minHeight: '40px !important',
            },

            width: '30%',
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Search sx={{ mr: 1 }} />
              </InputAdornment>
            ),
          }}
        />
        <Button type="submit" variant="contained" sx={{ height: '40px' }}>
          Tìm kiếm
        </Button>
        <Box flexGrow={1} />
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenDialog()}
          sx={{ height: '40px' }}
        >
          Thêm học sinh
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Học sinh</TableCell>
              <TableCell>Số điện thoại</TableCell>
              <TableCell>Ngày sinh</TableCell>
              <TableCell>Giới tính</TableCell>
              <TableCell align="right">Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {students.map(student => (
              <TableRow key={student.id}>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar
                      src={student.avatar}
                      alt={student.fullName}
                      sx={{ width: 40, height: 40 }}
                    >
                      {student.fullName?.charAt(0) || '?'}
                    </Avatar>
                    <Typography fontWeight={600}>{student.fullName}</Typography>
                  </Box>
                </TableCell>
                <TableCell>{student.phoneNumber}</TableCell>
                <TableCell>
                  {student.dateOfBirth
                    ? new Date(student.dateOfBirth).toLocaleDateString('vi-VN')
                    : ''}
                </TableCell>
                <TableCell>
                  {student.gender === EGender.MALE ? 'Nam' : 'Nữ'}
                </TableCell>
                <TableCell align="right">
                  <Tooltip title="Xem chi tiết">
                    <IconButton onClick={() => handleViewDetail(student)}>
                      <Visibility />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Chỉnh sửa">
                    <IconButton onClick={() => handleOpenDialog(student)}>
                      <Edit />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Xóa học sinh">
                    <IconButton
                      color="error"
                      onClick={() => handleDeleteClick(student)}
                    >
                      <Delete />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
            {students.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  Không có học sinh nào.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination Component */}
      <Pagination
        currentPage={pagination.currentPage}
        totalItems={pagination.total}
        itemsPerPage={pageSize}
        currentItems={students.length}
        hasMore={pagination.hasMore}
        loading={false}
        onPageChange={handlePageChange}
        showLoadMore={false}
        infoText={`Hiển thị ${students.length} / ${pagination.total} học sinh`}
        loadingText="Đang tải..."
      />

      {/* Modal Components */}
      <StudentFormModal
        open={openDialog}
        editing={editing}
        form={form}
        onClose={handleCloseDialog}
        onSave={handleSave}
        onFormChange={handleFormChange}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={2000}
        onClose={() => setSnackbar({ open: false, message: '' })}
        message={snackbar.message}
      />
    </Container>
  );
}
