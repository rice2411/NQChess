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
import { CloudinaryService } from '@/services/cloudinary.service';
import { StudentService } from '@/services/student.service';
import { useGlobalLoadingStore } from '@/store/useGlobalLoadingStore';

interface StudentFormModalProps {
  open: boolean;
  editing: IStudent | null;
  form: {
    fullName: string;
    phoneNumber: string;
    dateOfBirth: string;
    avatar: string;
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
  avatar: string;
  gender: EGender;
};

export default function StudentFormModal({
  open,
  editing,
  form,
  onClose,
  onSave,
}: StudentFormModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const loading = useGlobalLoadingStore(state => state.loading);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>(
    form?.avatar || ''
  );

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: form,
  });

  useEffect(() => {
    reset(form);
    setAvatarPreview(form?.avatar || '');
    setAvatarFile(null);
  }, [open, form, reset]);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const onSubmit = async (values: FormValues) => {
    useGlobalLoadingStore.getState().setLoading(true);
    try {
      let avatarUrl = values?.avatar;

      // Upload avatar nếu có file mới
      if (avatarFile) {
        const uploadResult = await CloudinaryService.uploadImage(avatarFile);
        if (uploadResult.success && uploadResult.url) {
          avatarUrl = uploadResult.url;
        } else {
          throw new Error(uploadResult.error || 'Không thể upload hình ảnh');
        }
      }

      // Chuẩn bị dữ liệu học sinh
      const studentData = {
        fullName: values.fullName,
        phoneNumber: values.phoneNumber,
        dateOfBirth: values.dateOfBirth,
        avatar: avatarUrl,
        gender: values.gender,
      };

      // Tạo hoặc cập nhật học sinh
      if (editing) {
        await StudentService.updateStudent(editing.id, studentData);
      } else {
        await StudentService.createStudent(studentData);
      }

      // Ẩn GlobalLoading trước khi gọi callback
      useGlobalLoadingStore.getState().setLoading(false);

      // Gọi callback để refresh danh sách và đóng modal
      onSave(avatarUrl);
      onClose();
    } catch (error) {
      console.error('Error saving student:', error);
      // Có thể hiển thị thông báo lỗi ở đây
      useGlobalLoadingStore.getState().setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
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
              src={avatarPreview}
              alt={watch('fullName')}
              sx={{ width: 80, height: 80, mb: 1, fontSize: 32 }}
            >
              {watch('fullName')?.charAt(0) || '?'}
            </Avatar>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
            <IconButton
              color="primary"
              component="span"
              onClick={handleAvatarClick}
              disabled={loading}
              sx={{ position: 'relative' }}
            >
              <PhotoCamera />
            </IconButton>
            <Typography variant="caption" color="text.secondary">
              Ảnh đại diện
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
