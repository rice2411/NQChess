'use client';
import React, { useEffect, useState } from 'react';
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
  Tooltip,
  Chip,
} from '@mui/material';
import { Add, Edit, Delete, Group } from '@mui/icons-material';
import ClassService from '@/services/class.service';
import { IClass, EClassStatus } from '@/interfaces/class.interface';
import AddEditClassModal from './Modal/AddEditClassModal';
import Pagination from '@/components/ui/Pagination';
import { useModalConfirm } from '@/hooks/useModalConfirm';

export default function ClassManagement() {
  const [classes, setClasses] = useState<IClass[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [editing, setEditing] = useState<IClass | null>(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  // Confirm delete hook
  const { confirm } = useModalConfirm();

  useEffect(() => {
    fetchClasses();
    // eslint-disable-next-line
  }, [page]);

  async function fetchClasses() {
    try {
      setLoading(true);
      const res = await ClassService.getClasses(page, pageSize);
      setClasses(res.classes);
      setTotal(res.total);
    } catch (error) {
      setSnackbar({ open: true, message: 'Không thể tải danh sách lớp học' });
    } finally {
      setLoading(false);
    }
  }

  function handleOpenModal(cls?: IClass) {
    setEditing(cls || null);
    setOpenModal(true);
  }

  function handleCloseModal() {
    setEditing(null);
    setOpenModal(false);
  }

  async function handleSaveClass(data: Partial<IClass>) {
    try {
      setLoading(true);
      if (editing) {
        await ClassService.updateClass(editing.id, data);
        setSnackbar({ open: true, message: 'Cập nhật lớp thành công!' });
      } else {
        await ClassService.createClass(data as IClass);
        setSnackbar({ open: true, message: 'Thêm lớp thành công!' });
      }
      handleCloseModal();
      fetchClasses();
    } catch (error) {
      console.log(error);
      setSnackbar({ open: true, message: 'Có lỗi khi lưu lớp học' });
    } finally {
      setLoading(false);
    }
  }

  function handleDeleteClick(cls: IClass) {
    confirm(
      async () => {
        setLoading(true);
        await ClassService.deleteClass(cls.id);
        setSnackbar({ open: true, message: 'Đã xóa lớp học!' });
        fetchClasses();
      },
      {
        message: `Bạn có chắc chắn muốn xóa lớp học "${cls.name}" không? Hành động này không thể hoàn tác.`,
      }
    );
  }

  return (
    <Container maxWidth={false} sx={{ mt: 4, mx: 0, width: '100%' }}>
      <Typography variant="h4" fontWeight={700} color="primary" mb={3}>
        Quản lý lớp học
      </Typography>
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <Box flexGrow={1} />
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenModal()}
        >
          Thêm lớp học
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Tên lớp</TableCell>
              <TableCell>Lịch học</TableCell>
              <TableCell>Học phí</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell>Số học sinh</TableCell>
              <TableCell align="right">Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {classes.map(cls => (
              <TableRow key={cls.id}>
                <TableCell>
                  <Typography fontWeight={600}>{cls.name}</Typography>
                </TableCell>
                <TableCell>
                  {cls.schedules?.map((sch, idx) => (
                    <Chip
                      key={idx}
                      label={sch}
                      size="small"
                      sx={{ mr: 0.5, mb: 0.5 }}
                    />
                  ))}
                </TableCell>
                <TableCell>{cls.tuition?.toLocaleString()} đ</TableCell>
                <TableCell>
                  <Chip
                    label={
                      cls.status === EClassStatus.ACTIVE
                        ? 'Đang học'
                        : cls.status === EClassStatus.NOT_STARTED
                          ? 'Chưa bắt đầu'
                          : 'Đã kết thúc'
                    }
                    color={
                      cls.status === EClassStatus.ACTIVE
                        ? 'success'
                        : cls.status === EClassStatus.NOT_STARTED
                          ? 'warning'
                          : 'default'
                    }
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Tooltip title="Số học sinh">
                    <Chip
                      icon={<Group />}
                      label={cls.students?.length || 0}
                      size="small"
                    />
                  </Tooltip>
                </TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => handleOpenModal(cls)}>
                    <Edit />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDeleteClick(cls)}
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {classes.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  Không có lớp học nào.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination Component */}
      <Pagination
        currentPage={page}
        totalItems={total}
        itemsPerPage={pageSize}
        currentItems={classes.length}
        hasMore={classes.length < total}
        loading={loading}
        onPageChange={setPage}
        showLoadMore={false}
        infoText={`Hiển thị ${classes.length} / ${total} lớp học`}
        loadingText="Đang tải..."
      />

      {/* Modal Components */}
      <AddEditClassModal
        open={openModal}
        editing={editing}
        onClose={handleCloseModal}
        onSave={handleSaveClass}
        loading={loading}
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
