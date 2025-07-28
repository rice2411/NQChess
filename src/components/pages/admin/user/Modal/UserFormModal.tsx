'use client';

import React, { useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Alert,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { IUser, EUserRole } from '@/interfaces/user.interface';
import UserService from '@/services/user.service';
import { useGlobalLoadingStore } from '@/store/useGlobalLoadingStore';
import { useModalAlert } from '@/hooks/useModalAlert';

interface UserFormModalProps {
  open: boolean;
  editing: IUser | null;
  form: {
    username: string;
    password: string;
    role: EUserRole;
  };
  onClose: () => void;
  onSave: () => void;
  onFormChange: (field: string, value: string | EUserRole) => void;
}

type FormValues = {
  username: string;
  password: string;
  role: EUserRole;
};

export default function UserFormModal({
  open,
  editing,
  onClose,
  onSave,
  onFormChange,
}: UserFormModalProps) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      username: '',
      password: '',
      role: EUserRole.TEACHER,
    },
  });

  const setGlobalLoading = useGlobalLoadingStore(state => state.setLoading);
  const modalAlert = useModalAlert();

  // Reset form khi editing thay đổi
  useEffect(() => {
    if (editing) {
      reset({
        username: editing.username,
        password: '',
        role: editing.role,
      });
    } else {
      reset({
        username: '',
        password: '',
        role: EUserRole.TEACHER,
      });
    }
  }, [editing, reset]);

  const onSubmit = async (values: FormValues) => {
    try {
      setGlobalLoading(true);

      if (editing) {
        // Cập nhật user
        await UserService.updateUser(editing.id, {
          username: values.username,
          role: values.role,
        });
      } else {
        // Tạo user mới
        await UserService.createUser({
          username: values.username,
          password: values.password,
          role: values.role,
        });
      }

      onSave();
      onClose();
    } catch (error: any) {
      console.error('Error saving user:', error);
      modalAlert?.alert({
        title: 'Lỗi',
        message: error.message || 'Có lỗi xảy ra khi lưu tài khoản',
      });
    } finally {
      setGlobalLoading(false);
    }
  };

  const handleFormChange = (field: keyof FormValues, value: any) => {
    onFormChange(field, value);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {editing ? 'Cập nhật tài khoản' : 'Thêm tài khoản mới'}
      </DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent
          sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
        >
          {/* Alert cho admin */}
          {editing && editing.role === EUserRole.ADMIN && (
            <Alert severity="warning">
              Tài khoản admin không thể chỉnh sửa thông tin cơ bản.
            </Alert>
          )}

          <Controller
            name="username"
            control={control}
            rules={{
              required: 'Tên đăng nhập là bắt buộc',
              minLength: {
                value: 3,
                message: 'Tên đăng nhập phải có ít nhất 3 ký tự',
              },
              pattern: {
                value: /^[a-zA-Z0-9_]+$/,
                message:
                  'Tên đăng nhập chỉ được chứa chữ cái, số và dấu gạch dưới',
              },
            }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Tên đăng nhập"
                fullWidth
                required
                error={!!errors.username}
                helperText={errors.username?.message}
                disabled={editing?.role === EUserRole.ADMIN}
                onChange={e => {
                  field.onChange(e);
                  handleFormChange('username', e.target.value);
                }}
              />
            )}
          />

          {!editing && (
            <Controller
              name="password"
              control={control}
              rules={{
                required: 'Mật khẩu là bắt buộc',
                minLength: {
                  value: 6,
                  message: 'Mật khẩu phải có ít nhất 6 ký tự',
                },
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Mật khẩu"
                  type="password"
                  fullWidth
                  required
                  error={!!errors.password}
                  helperText={errors.password?.message}
                  onChange={e => {
                    field.onChange(e);
                    handleFormChange('password', e.target.value);
                  }}
                />
              )}
            />
          )}

          <Controller
            name="role"
            control={control}
            rules={{ required: 'Vai trò là bắt buộc' }}
            render={({ field }) => (
              <FormControl fullWidth error={!!errors.role}>
                <InputLabel>Vai trò</InputLabel>
                <Select
                  {...field}
                  label="Vai trò"
                  disabled={editing?.role === EUserRole.ADMIN}
                  onChange={e => {
                    field.onChange(e);
                    handleFormChange('role', e.target.value);
                  }}
                >
                  <MenuItem value={EUserRole.TEACHER}>Giáo viên</MenuItem>
                  <MenuItem value={EUserRole.ADMIN}>Quản trị viên</MenuItem>
                </Select>
                {errors.role && (
                  <FormHelperText>{errors.role.message}</FormHelperText>
                )}
              </FormControl>
            )}
          />

          {/* Thông tin bổ sung */}
          <Box sx={{ mt: 2 }}>
            <Alert severity="info">
              <Box>
                <strong>Lưu ý:</strong>
                <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
                  <li>
                    Tài khoản mới sẽ được tạo với email: username@nqchess.com
                  </li>
                  <li>Tài khoản admin không thể chỉnh sửa hoặc xóa</li>
                  <li>Mỗi tài khoản sẽ có vai trò giáo viên mặc định</li>
                </ul>
              </Box>
            </Alert>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="inherit">
            Hủy
          </Button>
          <Button type="submit" variant="contained">
            {editing ? 'Cập nhật' : 'Thêm'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
