'use client';
import { TextField, MenuItem, Box, Typography } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Controller, Control, FieldErrors } from 'react-hook-form';
import { EClassStatus } from '@/interfaces/class.interface';
import { EUserRole } from '@/interfaces/user.interface';
import { UserService } from '@/services/user.service';
import { ClassFormValues } from '../AddEditClassModal';
import { formatVND, parseVND, validateVND } from '@/utils/format';
import { isValid, isBefore } from 'date-fns';
import { useEffect, useState } from 'react';

interface StepClassInfoProps {
  control: Control<ClassFormValues>;
  errors: FieldErrors<ClassFormValues>;
}

export default function StepClassInfo({ control, errors }: StepClassInfoProps) {
  const [teachers, setTeachers] = useState<
    Array<{ id: string; fullName: string }>
  >([]);
  const [loading, setLoading] = useState(true);

  // Lấy danh sách giáo viên
  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        setLoading(true);
        const allUsers = await UserService.getAllUsers();
        const teacherUsers = allUsers.filter(
          user => user.role === EUserRole.TEACHER
        );
        setTeachers(
          teacherUsers.map(user => ({ id: user.id, fullName: user.fullName }))
        );
      } catch (error) {
        console.error('Lỗi khi lấy danh sách giáo viên:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeachers();
  }, []);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box display="flex" flexDirection="column" gap={3} sx={{ pt: 2 }}>
        {/* Header với thông tin validation */}
        <Box sx={{ mb: 1 }}>
          <Typography variant="h6" gutterBottom>
            Thông tin lớp học
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Vui lòng nhập đầy đủ thông tin bắt buộc để tiếp tục
          </Typography>
        </Box>

        <Controller
          name="name"
          control={control}
          rules={{ required: 'Tên lớp học là bắt buộc' }}
          render={({ field }) => (
            <TextField
              {...field}
              label="Tên lớp học"
              fullWidth
              required
              error={!!errors.name}
              helperText={errors.name?.message}
              InputLabelProps={{ shrink: true }}
              placeholder="Nhập tên lớp học..."
            />
          )}
        />

        <Controller
          name="teacherId"
          control={control}
          rules={{ required: 'Giáo viên đảm nhiệm là bắt buộc' }}
          render={({ field }) => (
            <TextField
              {...field}
              select
              label="Giáo viên đảm nhiệm"
              fullWidth
              required
              error={!!errors.teacherId}
              helperText={errors.teacherId?.message}
              InputLabelProps={{ shrink: true }}
              disabled={loading}
              value={field.value || ''}
            >
              <MenuItem value="">
                <em>Chọn giáo viên...</em>
              </MenuItem>
              {teachers.map(teacher => (
                <MenuItem key={teacher.id} value={teacher.id}>
                  {teacher.fullName}
                </MenuItem>
              ))}
            </TextField>
          )}
        />
        <Controller
          name="tuition"
          control={control}
          rules={{
            required: 'Học phí là bắt buộc',
            pattern: {
              value: /^[\d,]+$/,
              message: 'Học phí phải là số',
            },
            validate: value => {
              if (!validateVND(value)) return 'Học phí phải lớn hơn 0';
              return true;
            },
          }}
          render={({ field }) => (
            <TextField
              {...field}
              label="Học phí (VNĐ/tháng)"
              fullWidth
              required
              error={!!errors.tuition}
              helperText={errors.tuition?.message}
              InputLabelProps={{ shrink: true }}
              value={formatVND(field.value)}
              onChange={e => {
                const rawValue = parseVND(e.target.value);
                field.onChange(rawValue);
              }}
              onBlur={e => {
                const rawValue = parseVND(e.target.value);
                if (rawValue) {
                  field.onChange(rawValue);
                }
              }}
              inputProps={{
                inputMode: 'numeric',
                placeholder: 'Nhập số tiền...',
              }}
            />
          )}
        />
        <Controller
          name="startDate"
          control={control}
          rules={{
            required: 'Ngày bắt đầu là bắt buộc',
            validate: value => (value && isValid(value)) || 'Ngày không hợp lệ',
          }}
          render={({ field }) => (
            <DatePicker
              label="Ngày bắt đầu lớp học"
              value={
                field.value instanceof Date && isValid(field.value)
                  ? field.value
                  : null
              }
              onChange={field.onChange}
              slotProps={{
                textField: {
                  fullWidth: true,
                  required: true,
                  error: !!errors.startDate,
                  helperText: errors.startDate?.message,
                  InputLabelProps: { shrink: true },
                  placeholder: 'Chọn ngày bắt đầu...',
                },
              }}
            />
          )}
        />
        <Controller
          name="endDate"
          control={control}
          rules={{
            validate: value => {
              if (!value) return true; // Ngày kết thúc không bắt buộc
              if (!isValid(value)) return 'Ngày không hợp lệ';

              // Lấy ngày bắt đầu từ form để so sánh
              const startDate = control._formValues.startDate;
              if (
                startDate &&
                isValid(startDate) &&
                isBefore(value, startDate)
              ) {
                return 'Ngày kết thúc phải sau ngày bắt đầu';
              }

              return true;
            },
          }}
          render={({ field }) => (
            <DatePicker
              label="Ngày kết thúc lớp học (tùy chọn)"
              value={
                field.value instanceof Date && isValid(field.value)
                  ? field.value
                  : null
              }
              onChange={field.onChange}
              slotProps={{
                textField: {
                  fullWidth: true,
                  error: !!errors.endDate,
                  helperText:
                    errors.endDate?.message ||
                    'Để trống nếu chưa xác định ngày kết thúc',
                  InputLabelProps: { shrink: true },
                  placeholder: 'Chọn ngày kết thúc...',
                },
              }}
            />
          )}
        />
        <Controller
          name="status"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              select
              label="Trạng thái lớp"
              fullWidth
              error={!!errors.status}
              helperText={errors.status?.message}
              InputLabelProps={{ shrink: true }}
            >
              <MenuItem value={EClassStatus.NOT_STARTED}>Chưa bắt đầu</MenuItem>
              <MenuItem value={EClassStatus.ACTIVE}>Đang học</MenuItem>
              <MenuItem value={EClassStatus.ENDED}>Đã kết thúc</MenuItem>
            </TextField>
          )}
        />
      </Box>
    </LocalizationProvider>
  );
}
