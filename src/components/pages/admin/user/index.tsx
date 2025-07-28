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
  Chip,
  Alert,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Search,
  Person,
  AdminPanelSettings,
  School,
} from '@mui/icons-material';
import { useEffect, useState } from 'react';
import { IUser, EUserRole } from '@/interfaces/user.interface';
import UserService from '@/services/user.service';
import { useGlobalLoadingStore } from '@/store/useGlobalLoadingStore';
import UserFormModal from './Modal/UserFormModal';
import { useModalConfirm } from '@/hooks/useModalConfirm';
import { useAuthStore } from '@/store/useAuthStore';

export default function UserManagement() {
  const [users, setUsers] = useState<IUser[]>([]);
  const [search, setSearch] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editing, setEditing] = useState<IUser | null>(null);
  const [form, setForm] = useState<{
    username: string;
    password: string;
    fullName: string;
    role: EUserRole;
  }>({
    username: '',
    password: '',
    fullName: '',
    role: EUserRole.TEACHER,
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });
  const [mounted, setMounted] = useState(false);

  // Global loading store
  const setGlobalLoading = useGlobalLoadingStore(state => state.setLoading);

  // Auth store để kiểm tra user hiện tại
  const currentUser = useAuthStore(state => state.user);

  // Confirm delete hook
  const modalConfirm = useModalConfirm();

  // Kiểm tra mounted
  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch users
  useEffect(() => {
    if (mounted) {
      fetchUsers();
    }
  }, [mounted]);

  async function fetchUsers(searchText = '') {
    try {
      setGlobalLoading(true);

      const allUsers = await UserService.getAllUsers();

      // Filter theo search text
      const filteredUsers = searchText.trim()
        ? allUsers.filter(
            user =>
              user.username.toLowerCase().includes(searchText.toLowerCase()) ||
              user.fullName.toLowerCase().includes(searchText.toLowerCase())
          )
        : allUsers;

      setUsers(filteredUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
      setSnackbar({ open: true, message: 'Không thể tải danh sách tài khoản' });
    } finally {
      setGlobalLoading(false);
    }
  }

  function handleOpenDialog(user?: IUser) {
    setEditing(user || null);
    setForm(
      user
        ? {
            username: user.username,
            password: '',
            fullName: user.fullName,
            role: user.role,
          }
        : {
            username: '',
            password: '',
            fullName: '',
            role: EUserRole.TEACHER,
          }
    );
    setOpenDialog(true);
  }

  function handleCloseDialog() {
    setOpenDialog(false);
    setEditing(null);
    setForm({
      username: '',
      password: '',
      fullName: '',
      role: EUserRole.TEACHER,
    });
  }

  async function handleSave() {
    try {
      setGlobalLoading(true);

      // Refresh danh sách
      fetchUsers(search);
      setSnackbar({
        open: true,
        message: editing
          ? 'Cập nhật thành công!'
          : 'Thêm tài khoản thành công!',
      });
    } catch (error) {
      console.error('Error refreshing users:', error);
      setSnackbar({
        open: true,
        message: 'Có lỗi xảy ra khi tải danh sách tài khoản',
      });
      setGlobalLoading(false);
    }
  }

  function handleDeleteClick(user: IUser) {
    if (!mounted || !modalConfirm) return;

    // Kiểm tra không cho phép xóa admin
    if (user.role === EUserRole.ADMIN) {
      setSnackbar({
        open: true,
        message: 'Không thể xóa tài khoản admin!',
      });
      return;
    }

    // Kiểm tra không cho phép xóa chính mình
    if (currentUser && user.id === currentUser.uid) {
      setSnackbar({
        open: true,
        message: 'Không thể xóa tài khoản của chính mình!',
      });
      return;
    }

    modalConfirm.confirm(
      async () => {
        setGlobalLoading(true);
        await UserService.deleteUser(user.id);
        setSnackbar({ open: true, message: 'Đã xóa tài khoản!' });
        setGlobalLoading(false);
        fetchUsers(search);
      },
      {
        message: `Bạn có chắc chắn muốn xóa tài khoản ${user.username} không? Hành động này không thể hoàn tác.`,
      }
    );
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    fetchUsers(search);
  }

  function handleFormChange(field: string, value: string | EUserRole) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  function getRoleLabel(role: EUserRole): string {
    switch (role) {
      case EUserRole.ADMIN:
        return 'Quản trị viên';
      case EUserRole.TEACHER:
        return 'Giáo viên';
      default:
        return 'Không xác định';
    }
  }

  function getRoleColor(role: EUserRole): 'primary' | 'secondary' | 'default' {
    switch (role) {
      case EUserRole.ADMIN:
        return 'primary';
      case EUserRole.TEACHER:
        return 'secondary';
      default:
        return 'default';
    }
  }

  function getRoleIcon(role: EUserRole) {
    switch (role) {
      case EUserRole.ADMIN:
        return <AdminPanelSettings />;
      case EUserRole.TEACHER:
        return <School />;
      default:
        return <Person />;
    }
  }

  // Không render cho đến khi mounted
  if (!mounted) {
    return (
      <Container maxWidth={false} sx={{ mt: 4, mx: 0, width: '100%' }}>
        <Typography variant="h4" fontWeight={700} color="primary" mb={3}>
          Quản lý tài khoản
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
        Quản lý tài khoản
      </Typography>

      {/* Alert thông báo */}
      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body2">
          <strong>Lưu ý:</strong> Tài khoản admin không thể chỉnh sửa hoặc xóa.
          Mỗi tài khoản mới sẽ được tạo với vai trò giáo viên.
        </Typography>
      </Alert>

      <Box
        component="form"
        onSubmit={handleSearch}
        sx={{ display: 'flex', gap: 2, mb: 2, height: '40px' }}
      >
        <TextField
          placeholder="Tìm kiếm theo tên hoặc tên đăng nhập..."
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
          Thêm tài khoản
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Tài khoản</TableCell>
              <TableCell>Vai trò</TableCell>
              <TableCell>Ngày tạo</TableCell>
              <TableCell>Ngày cập nhật</TableCell>
              <TableCell align="right">Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map(user => (
              <TableRow key={user.id}>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ width: 40, height: 40 }}>
                      {getRoleIcon(user.role)}
                    </Avatar>
                    <Box>
                      <Typography fontWeight={600}>{user.fullName}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        @{user.username}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip
                    label={getRoleLabel(user.role)}
                    color={getRoleColor(user.role)}
                    size="small"
                    icon={getRoleIcon(user.role)}
                  />
                </TableCell>
                <TableCell>
                  {user.createdAt
                    ? new Date(user.createdAt).toLocaleDateString('vi-VN')
                    : '-'}
                </TableCell>
                <TableCell>
                  {user.updatedAt
                    ? new Date(user.updatedAt).toLocaleDateString('vi-VN')
                    : '-'}
                </TableCell>
                <TableCell align="right">
                  <Tooltip title="Chỉnh sửa">
                    <IconButton
                      onClick={() => handleOpenDialog(user)}
                      disabled={user.role === EUserRole.ADMIN}
                    >
                      <Edit />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Xóa tài khoản">
                    <IconButton
                      color="error"
                      onClick={() => handleDeleteClick(user)}
                      disabled={
                        user.role === EUserRole.ADMIN ||
                        (currentUser ? user.id === currentUser.uid : false)
                      }
                    >
                      <Delete />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
            {users.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  Không có tài khoản nào.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modal Components */}
      <UserFormModal
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
