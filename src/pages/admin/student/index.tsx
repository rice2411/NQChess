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
} from '@mui/material';
import { Add, Edit, Delete, Search } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import { EGender, IStudent } from '@/interfaces/student.interface';
import StudentService from '@/services/student.service';
import Pagination from '@/components/ui/Pagination';
import { usePagination } from '@/hooks/usePagination';
import { useGlobalLoadingStore } from '@/store/useGlobalLoadingStore';
import NQTextField from '@/components/ui/NQTextField';
import { StudentFormModal, DeleteConfirmModal } from './Modal';

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

  // Delete modal state
  const [deleteModal, setDeleteModal] = useState({
    open: false,
    student: null as IStudent | null,
    loading: false,
  });

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

  // Fetch students
  useEffect(() => {
    fetchStudents();
  }, []);

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

      if (editing) {
        // Update
        await StudentService.updateStudent(editing.id, form);
        setSnackbar({ open: true, message: 'Cập nhật thành công!' });
      } else {
        // Add
        await StudentService.createStudent(form);
        setSnackbar({ open: true, message: 'Thêm học sinh thành công!' });
      }
      handleCloseDialog();
      fetchStudents(search, true); // Reset pagination khi thêm/sửa
    } catch (error) {
      console.error('Error saving student:', error);
      setSnackbar({ open: true, message: 'Có lỗi xảy ra khi lưu học sinh' });
    } finally {
      setGlobalLoading(false);
    }
  }

  function handleDeleteClick(student: IStudent) {
    setDeleteModal({
      open: true,
      student,
      loading: false,
    });
  }

  function handleDeleteCancel() {
    setDeleteModal({
      open: false,
      student: null,
      loading: false,
    });
  }

  async function handleDeleteConfirm() {
    if (!deleteModal.student) return;

    try {
      setDeleteModal(prev => ({ ...prev, loading: true }));
      setGlobalLoading(true);

      await StudentService.deleteStudent(deleteModal.student.id);
      setSnackbar({ open: true, message: 'Đã xóa học sinh!' });
      fetchStudents(search, true); // Reset pagination khi xóa
      handleDeleteCancel();
    } catch (error) {
      console.error('Error deleting student:', error);
      setSnackbar({ open: true, message: 'Không thể xóa học sinh' });
    } finally {
      setDeleteModal(prev => ({ ...prev, loading: false }));
      setGlobalLoading(false);
    }
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

  return (
    <Container sx={{ mt: 4, mx: 0, width: '100%' }}>
      <Typography variant="h4" fontWeight={700} color="primary" mb={3}>
        Quản lý học sinh
      </Typography>
      <Box
        component="form"
        onSubmit={handleSearch}
        sx={{ display: 'flex', gap: 2, mb: 2, height: '40px' }}
      >
        <NQTextField
          placeholder="Tìm kiếm theo tên..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          sx={{
            '& .MuiInputBase-root': {
              padding: '0 !important',
              minHeight: '40px !important',
            },

            width: '30%',
          }}
          endAdornment={<Search sx={{ mr: 1 }} />}
        />
        <Button type="submit" variant="outlined">
          Tìm kiếm
        </Button>
        <Box flexGrow={1} />
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenDialog()}
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
                      {student.fullName.charAt(0)}
                    </Avatar>
                    <Box>
                      <Typography variant="body2" fontWeight={500}>
                        {student.fullName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {student.gender === EGender.MALE ? 'Nam' : 'Nữ'}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>{student.phoneNumber}</TableCell>
                <TableCell>{student.dateOfBirth}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => handleOpenDialog(student)}>
                    <Edit />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDeleteClick(student)}
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {students.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} align="center">
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
        loading={pagination.loading}
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

      <DeleteConfirmModal
        open={deleteModal.open}
        studentName={deleteModal.student?.fullName || ''}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        loading={deleteModal.loading}
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
