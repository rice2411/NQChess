import React from 'react';
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
  SelectChangeEvent,
} from '@mui/material';
import { EGender, IStudent } from '@/interfaces/student.interface';
import NQTextField from '@/components/ui/NQTextField';

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
  onSave: () => void;
  onFormChange: (field: string, value: string | EGender) => void;
}

export default function StudentFormModal({
  open,
  editing,
  form,
  onClose,
  onSave,
  onFormChange,
}: StudentFormModalProps) {
  const handleInputChange =
    (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      onFormChange(field, e.target.value);
    };

  const handleSelectChange = (event: SelectChangeEvent<EGender>) => {
    onFormChange('gender', event.target.value as EGender);
  };

  const isFormValid = form.fullName && form.phoneNumber && form.dateOfBirth;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {editing ? 'Cập nhật học sinh' : 'Thêm học sinh'}
      </DialogTitle>
      <DialogContent
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          pt: 2,
        }}
      >
        <NQTextField
          label="Họ tên"
          value={form.fullName}
          onChange={handleInputChange('fullName')}
          fullWidth
          required
        />
        <NQTextField
          label="Số điện thoại"
          value={form.phoneNumber}
          onChange={handleInputChange('phoneNumber')}
          fullWidth
          required
        />
        <NQTextField
          label="Ngày sinh"
          type="date"
          value={form.dateOfBirth}
          onChange={handleInputChange('dateOfBirth')}
          fullWidth
          required
          InputLabelProps={{ shrink: true }}
        />
        <NQTextField
          label="URL ảnh đại diện"
          value={form.avatar}
          onChange={handleInputChange('avatar')}
          fullWidth
          placeholder="https://example.com/avatar.jpg"
        />
        <FormControl fullWidth>
          <InputLabel>Giới tính</InputLabel>
          <Select
            value={form.gender}
            label="Giới tính"
            onChange={handleSelectChange}
          >
            <MenuItem value={EGender.MALE}>Nam</MenuItem>
            <MenuItem value={EGender.FEMALE}>Nữ</MenuItem>
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button onClick={onSave} variant="contained" disabled={!isFormValid}>
          {editing ? 'Lưu' : 'Thêm'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
