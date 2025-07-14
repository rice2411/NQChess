'use client';
import {
  Box,
  TextField,
  MenuItem,
  Chip,
  IconButton,
  Typography,
} from '@mui/material';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { Add, Delete } from '@mui/icons-material';
import { Controller, Control, FieldErrors, useWatch } from 'react-hook-form';
import { ClassFormValues } from '../AddEditClassModal';
import { format, isValid } from 'date-fns';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

interface StepSchedulesProps {
  control: Control<ClassFormValues>;
  errors: FieldErrors<ClassFormValues>;
  scheduleFields: any[];
  appendSchedule: ({ label }: { label: string }) => void;
  removeSchedule: (index: number) => void;
}

export default function StepSchedules({
  control,
  scheduleFields,
  appendSchedule,
  removeSchedule,
}: StepSchedulesProps) {
  const weekdays = [
    'Thứ 2',
    'Thứ 3',
    'Thứ 4',
    'Thứ 5',
    'Thứ 6',
    'Thứ 7',
    'Chủ nhật',
  ];
  // Watch các giá trị để validation
  const startTime = useWatch({ control, name: 'startTime' });
  const endTime = useWatch({ control, name: 'endTime' });
  const weekday = useWatch({ control, name: 'weekday' });

  const handleAddSchedule = () => {
    if (!startTime || !endTime || !weekday) {
      return;
    }
    const start =
      startTime instanceof Date && isValid(startTime)
        ? startTime
        : new Date(0, 0, 0, 0, 0);
    const end =
      endTime instanceof Date && isValid(endTime)
        ? endTime
        : new Date(0, 0, 0, 23, 59);
    const scheduleText = `${format(start, 'HH:mm')} - ${format(end, 'HH:mm')} ${weekday}`;
    if (scheduleFields.length < 2) {
      appendSchedule({ label: scheduleText });
    }
  };

  const handleRemoveSchedule = (index: number) => {
    removeSchedule(index);
  };

  return (
    <Box display="flex" flexDirection="column" gap={3} sx={{ pt: 2 }}>
      {/* Header với thông tin */}
      <Box sx={{ mb: 1 }}>
        <Typography variant="h6" gutterBottom>
          Lịch học
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Chọn giờ bắt đầu, kết thúc và thứ để tạo buổi học
        </Typography>
      </Box>

      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Box display="flex" gap={2} alignItems="center" flexWrap="wrap">
          <Controller
            name="startTime"
            control={control}
            render={({ field }) => (
              <TimePicker
                label="Giờ bắt đầu"
                value={field.value}
                onChange={value =>
                  field.onChange(
                    value instanceof Date && isValid(value)
                      ? value
                      : new Date(0, 0, 0, 0, 0)
                  )
                }
                ampm={false}
                sx={{ width: 140 }}
              />
            )}
          />
          <Controller
            name="endTime"
            control={control}
            render={({ field }) => (
              <TimePicker
                label="Giờ kết thúc"
                value={field.value}
                onChange={value =>
                  field.onChange(
                    value instanceof Date && isValid(value)
                      ? value
                      : new Date(0, 0, 0, 23, 59)
                  )
                }
                ampm={false}
                sx={{ width: 140 }}
              />
            )}
          />
          <Controller
            name="weekday"
            control={control}
            defaultValue="Thứ 2"
            render={({ field }) => (
              <TextField
                select
                label="Thứ"
                value={field.value}
                onChange={field.onChange}
                sx={{ width: 120 }}
                InputLabelProps={{ shrink: true }}
              >
                {weekdays.map(w => (
                  <MenuItem key={w} value={w}>
                    {w}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
          <IconButton
            onClick={handleAddSchedule}
            disabled={
              scheduleFields.length >= 2 || !startTime || !endTime || !weekday
            }
            color="primary"
            sx={{ mt: 1 }}
            title={
              !startTime
                ? 'Vui lòng chọn giờ bắt đầu'
                : !endTime
                  ? 'Vui lòng chọn giờ kết thúc'
                  : !weekday
                    ? 'Vui lòng chọn thứ'
                    : scheduleFields.length >= 2
                      ? 'Đã đủ 2 buổi học'
                      : 'Thêm buổi học'
            }
          >
            <Add />
          </IconButton>
        </Box>
      </LocalizationProvider>

      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        {scheduleFields.map((field, index) => (
          <Chip
            key={field.id || index}
            label={
              typeof field.label === 'string'
                ? field.label
                : String(field.label)
            }
            onDelete={() => handleRemoveSchedule(index)}
            color="primary"
            sx={{ mb: 1 }}
            deleteIcon={<Delete />}
          />
        ))}
        {scheduleFields.length === 0 && (
          <Chip
            label="Chưa có buổi học nào"
            variant="outlined"
            color="secondary"
          />
        )}
      </Box>

      {/* Helper text */}
      {scheduleFields.length === 0 && (
        <Typography variant="body2" color="text.secondary">
          Vui lòng thêm ít nhất 1 buổi học để tiếp tục
        </Typography>
      )}

      {/* Helper text cho điều kiện thêm buổi học */}
      {(!startTime || !endTime || !weekday) && (
        <Typography variant="body2" color="warning.main">
          Vui lòng chọn đầy đủ giờ bắt đầu, giờ kết thúc và thứ để thêm buổi học
        </Typography>
      )}
    </Box>
  );
}
