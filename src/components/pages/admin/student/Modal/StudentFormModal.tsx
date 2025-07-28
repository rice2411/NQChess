'use client';
import React, { useRef, useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Avatar,
  IconButton,
  Box,
  CircularProgress,
  Typography,
} from '@mui/material';
import { PhotoCamera } from '@mui/icons-material';
import { EGender, IStudent } from '@/interfaces/student.interface';
import { useForm, Controller } from 'react-hook-form';
import { StudentService } from '@/services/student.service';
import { useGlobalLoadingStore } from '@/store/useGlobalLoadingStore';
import { getAvatarUrl } from '@/constants/avatar';

interface StudentFormModalProps {
  open: boolean;
  editing: IStudent | null;
  form: {
    fullName: string;
    phoneNumber: string;
    dateOfBirth: string;
    gender: EGender;
  };
  onClose: () => void;
  onSave: (avatarUrl?: string) => void;
  onFormChange: (field: string, value: string | EGender) => void;
}

type FormValues = {
  fullName: string;
  phoneNumber: string;
  dateOfBirth: string;
  gender: EGender;
};

export default function StudentFormModal({
  open,
  editing,
  form,
  onClose,
  onSave,
}: StudentFormModalProps) {
  const loading = useGlobalLoadingStore(state => state.loading);

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: form,
  });

  const watchedGender = watch('gender');
  const watchedFullName = watch('fullName');

  useEffect(() => {
    reset(form);
  }, [open, form, reset]);

  // Tự động tạo avatar dựa trên giới tính và tên
  const generateAvatar = (gender: EGender, fullName: string) => {
    return getAvatarUrl(gender, fullName.replace(/\s+/g, ''));
  };

  const onSubmit = async (values: FormValues) => {
    useGlobalLoadingStore.getState().setLoading(true);
    try {
      // Tự động tạo avatar dựa trên giới tính và tên
      const avatarUrl = generateAvatar(values.gender, values.fullName);

      if (editing) {
        await StudentService.updateStudent(editing.id, {
          ...values,
          avatar: avatarUrl,
        });
      } else {
        await StudentService.createStudent({
          ...values,
          avatar: avatarUrl,
        });
      }

      useGlobalLoadingStore.getState().setLoading(false);
      onSave(avatarUrl);
      onClose();
    } catch (error) {
      console.error('Error saving student:', error);
      useGlobalLoadingStore.getState().setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      disableScrollLock
    >
      <DialogTitle>
        {editing ? 'Cập nhật học sinh' : 'Thêm học sinh'}
      </DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            pt: 2,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              mb: 2,
            }}
          >
            <Avatar
              src={generateAvatar(watchedGender, watchedFullName)}
              alt={watchedFullName}
              sx={{ width: 80, height: 80, mb: 1, fontSize: 32 }}
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
              {watchedFullName?.charAt(0) || '?'}
            </Avatar>
            <Typography variant="caption" color="text.secondary" align="center">
              Ảnh đại diện tự động tạo
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              align="center"
              sx={{ fontSize: '0.7rem' }}
            >
              Dựa trên giới tính và tên học sinh
            </Typography>
          </Box>
          <Controller
            name="fullName"
            control={control}
            rules={{ required: 'Họ tên là bắt buộc' }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Họ tên"
                fullWidth
                required
                error={!!errors.fullName}
                helperText={errors.fullName?.message}
              />
            )}
          />
          <Controller
            name="phoneNumber"
            control={control}
            rules={{ required: 'Số điện thoại là bắt buộc' }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Số điện thoại"
                fullWidth
                required
                error={!!errors.phoneNumber}
                helperText={errors.phoneNumber?.message}
              />
            )}
          />
          <Controller
            name="dateOfBirth"
            control={control}
            rules={{ required: 'Ngày sinh là bắt buộc' }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Ngày sinh"
                type="date"
                fullWidth
                required
                InputLabelProps={{ shrink: true }}
                error={!!errors.dateOfBirth}
                helperText={errors.dateOfBirth?.message}
              />
            )}
          />
          <Controller
            name="gender"
            control={control}
            rules={{ required: 'Giới tính là bắt buộc' }}
            render={({ field }) => (
              <FormControl fullWidth>
                <InputLabel>Giới tính</InputLabel>
                <Select
                  {...field}
                  label="Giới tính"
                  value={field.value}
                  onChange={field.onChange}
                  error={!!errors.gender}
                >
                  <MenuItem value={EGender.MALE}>Nam</MenuItem>
                  <MenuItem value={EGender.FEMALE}>Nữ</MenuItem>
                </Select>
              </FormControl>
            )}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={loading}>
            Hủy
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={16} /> : undefined}
          >
            {loading ? 'Đang xử lý...' : editing ? 'Lưu' : 'Thêm'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
