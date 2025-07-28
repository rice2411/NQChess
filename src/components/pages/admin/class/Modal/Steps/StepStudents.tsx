'use client';
import {
  Box,
  Card,
  CardContent,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  IconButton,
  Chip,
  MenuItem,
  Divider,
  Alert,
  Checkbox,
  TextField,
  ListItemIcon,
} from '@mui/material';
import {
  PersonAdd,
  PersonRemove,
  Person,
  Search,
  Clear,
  CheckBox,
  CheckBoxOutlineBlank,
  IndeterminateCheckBox,
  DeleteSweep,
} from '@mui/icons-material';
import {
  IStudentClass,
  EStudentClassType,
  EStudentClassStatus,
} from '@/interfaces/class.interface';
import { IStudent } from '@/interfaces/student.interface';
import { StudentService } from '@/services/student.service';
import React from 'react';
import { useClientEffect } from '@/hooks/useSSR';

interface StepStudentsProps {
  studentFields: any[];
  appendStudent: (value: any) => void;
  removeStudent: (index: number) => void;
  updateStudent: (index: number, value: any) => void;
  control: any;
  errors: any;
  setValue: any;
  getValues: any;
  canRemoveStudents?: boolean;
}

export default function StepStudents({
  studentFields,
  appendStudent,
  removeStudent,
  getValues,
  canRemoveStudents = true,
}: StepStudentsProps) {
  const [allStudents, setAllStudents] = React.useState<IStudent[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [selectedStudents, setSelectedStudents] = React.useState<IStudent[]>(
    []
  );
  const [addType, setAddType] = React.useState<EStudentClassType>(
    EStudentClassType.FULL
  );
  const [addSession, setAddSession] = React.useState<string>('');
  const [searchText, setSearchText] = React.useState('');

  // Lấy schedules từ form
  const [sessionOptions, setSessionOptions] = React.useState<
    { value: string; label: string }[]
  >([]);

  // Watch schedules để cập nhật sessionOptions
  React.useEffect(() => {
    if (typeof window !== 'undefined' && getValues) {
      const schedules = getValues('schedules') || [];
      const options = schedules.map((schedule: any) => ({
        value: schedule.label,
        label: schedule.label,
      }));
      setSessionOptions(options);

      // Reset addSession nếu session hiện tại không còn tồn tại trong options
      if (
        addSession &&
        !options.find(
          (option: { value: string; label: string }) =>
            option.value === addSession
        )
      ) {
        setAddSession('');
      }
    }
  }, [getValues, addSession]);

  // Load danh sách học sinh từ Firebase
  useClientEffect(() => {
    const loadStudents = async () => {
      try {
        setLoading(true);
        const students = await StudentService.getAllStudents();
        setAllStudents(students);
      } catch (error) {
        console.error('Error loading students:', error);
        // Fallback to empty array if error
        setAllStudents([]);
      } finally {
        setLoading(false);
      }
    };

    loadStudents();
  }, []);

  const availableStudents = (
    typeof window !== 'undefined' ? allStudents : []
  ).filter(
    student =>
      !(studentFields || []).some(field => field.studentId === student.id)
  );

  // Filter students based on search text
  const filteredStudents = availableStudents.filter(student => {
    if (!searchText) return true;
    const searchLower = searchText.toLowerCase();
    const fullName = (student.fullName || '').toLowerCase();
    const phoneNumber = (student.phoneNumber || '').toLowerCase();
    return fullName.includes(searchLower) || phoneNumber.includes(searchLower);
  });

  const handleAddStudents = () => {
    if (!selectedStudents || selectedStudents.length === 0) return;

    const newStudentClasses: IStudentClass[] = selectedStudents.map(
      student => ({
        studentId: student.id,
        fullName: student.fullName,
        joinDate: typeof window !== 'undefined' ? new Date() : new Date(0),
        type: addType,
        session: addType === EStudentClassType.HALF ? addSession : undefined,
        status: EStudentClassStatus.ONLINE,
        tuition: 0,
      })
    );

    // Thêm tất cả học sinh đã chọn
    newStudentClasses.forEach(studentClass => {
      appendStudent(studentClass);
    });

    // Reset form
    setSelectedStudents([]);
    setAddType(EStudentClassType.FULL);
    setAddSession('');
    setSearchText('');
  };

  const handleRemoveStudent = (index: number) => {
    removeStudent(index);
  };

  const handleRemoveAllStudents = () => {
    // Xóa tất cả học sinh bằng cách gọi removeStudent cho từng index
    // Xóa từ cuối lên để tránh lỗi index
    for (let i = studentFields.length - 1; i >= 0; i--) {
      removeStudent(i);
    }
  };

  const getStudentById = (studentId: string) => {
    return (allStudents || []).find(student => student.id === studentId);
  };

  const getSessionName = (sessionId?: string) => {
    if (!sessionId) return 'Full buổi';
    return sessionId;
  };

  const handleClearSelection = () => {
    setSelectedStudents([]);
  };

  const handleSelectAll = () => {
    if (selectedStudents.length === filteredStudents.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents([...filteredStudents]);
    }
  };

  const handleSelectStudent = (student: IStudent) => {
    const isSelected = selectedStudents.some(s => s.id === student.id);
    if (isSelected) {
      setSelectedStudents(selectedStudents.filter(s => s.id !== student.id));
    } else {
      setSelectedStudents([...selectedStudents, student]);
    }
  };

  const isAllSelected =
    filteredStudents.length > 0 &&
    selectedStudents.length === filteredStudents.length;
  const isIndeterminate =
    selectedStudents.length > 0 &&
    selectedStudents.length < filteredStudents.length;

  return (
    <Box display="flex" flexDirection="column" gap={4}>
      {/* Form thêm học sinh */}
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h6" mb={2}>
            {canRemoveStudents
              ? 'Thêm học sinh vào lớp'
              : 'Quản lý học sinh trong lớp'}
          </Typography>

          {/* Student Selection Section */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              🎯 Chọn học sinh ({availableStudents.length} học sinh có sẵn)
            </Typography>

            <TextField
              fullWidth
              size="small"
              placeholder="Tìm kiếm học sinh theo tên hoặc số điện thoại..."
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
              InputProps={{
                startAdornment: (
                  <Search sx={{ color: 'text.secondary', mr: 1 }} />
                ),
                endAdornment: selectedStudents.length > 0 && (
                  <IconButton
                    size="small"
                    onClick={handleClearSelection}
                    sx={{ mr: 1 }}
                  >
                    <Clear />
                  </IconButton>
                ),
              }}
              sx={{ mb: 2 }}
              helperText={
                selectedStudents.length > 0
                  ? `Đã chọn ${selectedStudents.length} học sinh`
                  : `${filteredStudents.length} học sinh có sẵn`
              }
            />

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Checkbox
                checked={isAllSelected}
                indeterminate={isIndeterminate}
                onChange={handleSelectAll}
                icon={<CheckBoxOutlineBlank />}
                checkedIcon={<CheckBox />}
                indeterminateIcon={<IndeterminateCheckBox />}
              />
              <Typography variant="body2">
                {isAllSelected
                  ? `Bỏ chọn tất cả (${filteredStudents.length})`
                  : `Chọn tất cả (${filteredStudents.length})`}
              </Typography>
            </Box>

            <Box
              sx={{
                maxHeight: '400px',
                overflow: 'auto',
                border: '1px solid #e0e0e0',
                borderRadius: 1,
                backgroundColor: 'background.paper',
              }}
            >
              {loading ? (
                <Box sx={{ p: 3, textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    Đang tải danh sách học sinh...
                  </Typography>
                </Box>
              ) : filteredStudents.length === 0 ? (
                <Box sx={{ p: 3, textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    {searchText
                      ? 'Không tìm thấy học sinh nào'
                      : 'Không có học sinh nào có sẵn'}
                  </Typography>
                </Box>
              ) : (
                filteredStudents.map(student => {
                  const isSelected = selectedStudents.some(
                    s => s.id === student.id
                  );
                  return (
                    <ListItem
                      key={student.id}
                      dense
                      component="div"
                      onClick={() => handleSelectStudent(student)}
                      sx={{
                        cursor: 'pointer',
                        '&:hover': { backgroundColor: 'action.hover' },
                        backgroundColor: isSelected
                          ? 'action.selected'
                          : 'transparent',
                        borderBottom: '1px solid #f0f0f0',
                        '&:last-child': { borderBottom: 'none' },
                      }}
                    >
                      <ListItemIcon>
                        <Checkbox
                          checked={isSelected}
                          icon={<CheckBoxOutlineBlank />}
                          checkedIcon={<CheckBox />}
                        />
                      </ListItemIcon>
                      <ListItemAvatar>
                        <Avatar
                          src={student?.avatar}
                          sx={{ width: 32, height: 32 }}
                        >
                          <Person sx={{ fontSize: 16 }} />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={student.fullName || ''}
                        secondary={student.phoneNumber || ''}
                        primaryTypographyProps={{
                          fontWeight: isSelected ? 600 : 400,
                        }}
                      />
                    </ListItem>
                  );
                })
              )}
            </Box>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Typography variant="subtitle2" gutterBottom>
            Cấu hình học tập cho học sinh đã chọn:
          </Typography>

          <RadioGroup
            row
            value={addType}
            onChange={e => {
              const newType = e.target.value as EStudentClassType;
              setAddType(newType);
              // Reset addSession khi chuyển sang Full buổi
              if (newType === EStudentClassType.FULL) {
                setAddSession('');
              }
            }}
            sx={{ mb: 2 }}
          >
            <FormControlLabel
              value={EStudentClassType.FULL}
              control={<Radio />}
              label="Full buổi"
            />
            <FormControlLabel
              value={EStudentClassType.HALF}
              control={<Radio />}
              label="Nửa buổi"
            />
          </RadioGroup>
          {addType === EStudentClassType.HALF && (
            <>
              {sessionOptions.length > 0 ? (
                <TextField
                  select
                  label="Chọn buổi học"
                  value={addSession}
                  onChange={e => setAddSession(e.target.value)}
                  size="small"
                  fullWidth
                  sx={{ mb: 2 }}
                  InputLabelProps={{ shrink: true }}
                  helperText="Chọn buổi học cụ thể cho học sinh nửa buổi"
                >
                  {sessionOptions.map(
                    (option: { value: string; label: string }) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    )
                  )}
                </TextField>
              ) : (
                <Alert severity="warning" sx={{ mb: 2 }}>
                  <Typography variant="body2">
                    Chưa có buổi học nào được tạo. Vui lòng quay lại bước 2 để
                    thêm buổi học.
                  </Typography>
                </Alert>
              )}
            </>
          )}
          <Button
            fullWidth
            variant="contained"
            startIcon={<PersonAdd />}
            onClick={handleAddStudents}
            disabled={
              !selectedStudents ||
              (selectedStudents && selectedStudents.length === 0) ||
              (addType === EStudentClassType.HALF &&
                (!addSession || sessionOptions.length === 0)) ||
              loading
            }
            sx={{ mt: 1 }}
          >
            Thêm{' '}
            {selectedStudents && selectedStudents.length > 0
              ? `${selectedStudents.length} học sinh`
              : 'học sinh'}{' '}
            vào lớp
          </Button>
        </CardContent>
      </Card>
      {/* Danh sách học sinh trong lớp */}
      <Card>
        <CardContent>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 2,
            }}
          >
            <Typography variant="h6">
              Học sinh trong lớp ({(studentFields || []).length})
            </Typography>
            {canRemoveStudents && (studentFields || []).length > 0 && (
              <Button
                variant="outlined"
                color="error"
                size="small"
                startIcon={<DeleteSweep />}
                onClick={handleRemoveAllStudents}
                sx={{ minWidth: 'auto' }}
              >
                Xóa tất cả
              </Button>
            )}
          </Box>
          <List dense>
            {(studentFields || []).map(
              (studentClass: IStudentClass, index: number) => {
                if (!studentClass) return null;
                const student = getStudentById(studentClass?.studentId);
                if (!student) return null;
                return (
                  <ListItem
                    key={studentClass?.studentId || index}
                    divider
                    secondaryAction={
                      canRemoveStudents ? (
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleRemoveStudent(index)}
                        >
                          <PersonRemove />
                        </IconButton>
                      ) : null
                    }
                  >
                    <ListItemAvatar>
                      <Avatar
                        src={student?.avatar}
                        sx={{ width: 40, height: 40 }}
                      >
                        <Person />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={student?.fullName || ''}
                      secondary={
                        <Box>
                          <Box
                            component="span"
                            sx={{
                              color: 'text.secondary',
                              fontSize: 13,
                              display: 'block',
                            }}
                          >
                            {student?.phoneNumber || ''}
                          </Box>
                          <Box
                            sx={{
                              mt: 1,
                              display: 'flex',
                              gap: 1,
                              flexWrap: 'wrap',
                            }}
                          >
                            <Chip
                              label={getSessionName(studentClass?.session)}
                              size="small"
                              color={
                                studentClass?.type === EStudentClassType.FULL
                                  ? 'primary'
                                  : 'secondary'
                              }
                            />
                            <Chip
                              label={
                                studentClass?.status ===
                                EStudentClassStatus.ONLINE
                                  ? 'Online'
                                  : 'Offline'
                              }
                              size="small"
                              variant="outlined"
                            />
                          </Box>
                        </Box>
                      }
                      disableTypography
                    />
                  </ListItem>
                );
              }
            )}
            {(studentFields || []).length === 0 && (
              <Typography
                variant="body2"
                color="text.secondary"
                textAlign="center"
              >
                Chưa có học sinh nào trong lớp
              </Typography>
            )}
          </List>
        </CardContent>
      </Card>
    </Box>
  );
}
