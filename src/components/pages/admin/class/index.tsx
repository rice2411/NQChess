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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
} from '@mui/material';
import { Add, Edit, Delete, Group } from '@mui/icons-material';
import ClassService from '@/services/class.service';
import { IClass, EClassStatus } from '@/interfaces/class.interface';
import AddEditClassModal from './Modal/AddEditClassModal';
import Pagination from '@/components/ui/Pagination';
import { useModalConfirm } from '@/hooks/useModalConfirm';
import { useGlobalLoadingStore } from '@/store/useGlobalLoadingStore';

// Function để tính toán trạng thái lớp dựa trên ngày
function getClassStatus(cls: IClass): EClassStatus {
  // Luôn ưu tiên trạng thái từ database nếu có
  if (cls.status) {
    return cls.status;
  }

  // Chỉ tính toán tự động nếu không có trạng thái từ database
  const now = new Date();
  const startDate = cls.startDate ? new Date(cls.startDate) : null;
  const endDate = cls.endDate ? new Date(cls.endDate) : null;

  // Nếu có ngày kết thúc và đã qua ngày kết thúc
  if (endDate && now > endDate) {
    return EClassStatus.ENDED;
  }

  // Nếu có ngày bắt đầu và chưa đến ngày bắt đầu
  if (startDate && now < startDate) {
    return EClassStatus.NOT_STARTED;
  }

  // Nếu đang trong khoảng thời gian học
  if (startDate && (!endDate || now <= endDate)) {
    return EClassStatus.ACTIVE;
  }

  // Fallback về NOT_STARTED
  return EClassStatus.NOT_STARTED;
}

// Function để lấy màu sắc cho trạng thái
function getStatusColor(
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

// Function để lấy label cho trạng thái
function getStatusLabel(status: EClassStatus): string {
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

export default function ClassManagement() {
  const [classes, setClasses] = useState<IClass[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [editing, setEditing] = useState<IClass | null>(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [loading, setLocalLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    title: '',
    message: '',
    action: null as (() => void) | null,
  });

  // Global loading store
  const { setLoading } = useGlobalLoadingStore();

  // Confirm delete hook
  const modalConfirm = useModalConfirm();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      fetchClasses();
    }
    // eslint-disable-next-line
  }, [page, mounted]);

  async function fetchClasses() {
    try {
      setLocalLoading(true);
      const res = await ClassService.getClasses(page, pageSize);
      setClasses(res.classes);
      setTotal(res.total);
    } catch (error) {
      console.error(error);
      setSnackbar({ open: true, message: 'Không thể tải danh sách lớp học' });
    } finally {
      setLocalLoading(false);
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

  function handleCloseConfirmDialog() {
    setConfirmDialog({
      open: false,
      title: '',
      message: '',
      action: null,
    });
  }

  function handleConfirmAction() {
    if (confirmDialog.action) {
      confirmDialog.action();
    }
    handleCloseConfirmDialog();
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
      setLoading(false); // Ẩn GlobalLoading trước khi fetch lại
      fetchClasses();
    } catch (error) {
      console.log(error);
      setSnackbar({ open: true, message: 'Có lỗi khi lưu lớp học' });
      setLoading(false); // Ẩn GlobalLoading khi có lỗi
    }
  }

  function handleDeleteClick(cls: IClass) {
    if (!mounted) return;

    const calculatedStatus = getClassStatus(cls);

    // Kiểm tra trạng thái trước khi cho phép xóa
    if (
      calculatedStatus === EClassStatus.ACTIVE ||
      calculatedStatus === EClassStatus.ENDED
    ) {
      setSnackbar({
        open: true,
        message: 'Không thể xóa lớp đang hoạt động hoặc đã kết thúc!',
      });
      return;
    }

    modalConfirm.confirm(
      async () => {
        setLoading(true);
        await ClassService.deleteClass(cls.id);
        setSnackbar({ open: true, message: 'Đã xóa lớp học!' });
        setLoading(false); // Ẩn GlobalLoading trước khi fetch lại
        fetchClasses();
      },
      {
        message: `Bạn có chắc chắn muốn xóa lớp học "${cls.name}" không? Hành động này không thể hoàn tác.`,
      }
    );
  }

  // Không render cho đến khi mounted
  if (!mounted) {
    return (
      <Container maxWidth={false} sx={{ mt: 4, mx: 0, width: '100%' }}>
        <Typography variant="h4" fontWeight={700} color="primary" mb={3}>
          Quản lý lớp học
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
              <TableCell>Ngày bắt đầu</TableCell>
              <TableCell>Ngày kết thúc</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell>Số học sinh</TableCell>
              <TableCell align="right">Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {classes.map(cls => {
              const calculatedStatus = getClassStatus(cls);
              return (
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
                    {cls.startDate
                      ? new Date(cls.startDate).toLocaleDateString('vi-VN')
                      : '-'}
                  </TableCell>
                  <TableCell>
                    {cls.endDate
                      ? new Date(cls.endDate).toLocaleDateString('vi-VN')
                      : '-'}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={getStatusLabel(calculatedStatus)}
                      color={getStatusColor(calculatedStatus)}
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
                    <Tooltip title="Chỉnh sửa lớp học">
                      <IconButton onClick={() => handleOpenModal(cls)}>
                        <Edit />
                      </IconButton>
                    </Tooltip>
                    <Tooltip
                      title={
                        calculatedStatus === EClassStatus.ACTIVE ||
                        calculatedStatus === EClassStatus.ENDED
                          ? 'Không thể xóa lớp đang hoạt động hoặc đã kết thúc'
                          : 'Xóa lớp học'
                      }
                    >
                      <span>
                        <IconButton
                          color="error"
                          disabled={
                            calculatedStatus === EClassStatus.ACTIVE ||
                            calculatedStatus === EClassStatus.ENDED
                          }
                          onClick={() => handleDeleteClick(cls)}
                        >
                          <Delete />
                        </IconButton>
                      </span>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              );
            })}
            {classes.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} align="center">
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

      {/* Confirmation Dialog */}
      <Dialog
        open={confirmDialog.open}
        onClose={handleCloseConfirmDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{confirmDialog.title}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {confirmDialog.message}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmDialog} color="inherit">
            Hủy
          </Button>
          <Button onClick={handleConfirmAction} variant="contained" autoFocus>
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={2000}
        onClose={() => setSnackbar({ open: false, message: '' })}
        message={snackbar.message}
      />
    </Container>
  );
}
