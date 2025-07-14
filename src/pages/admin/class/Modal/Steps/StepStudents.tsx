import {
  Box,
  Card,
  CardContent,
  Typography,
  Autocomplete,
  TextField,
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
} from '@mui/material';
import { PersonAdd, PersonRemove, Person } from '@mui/icons-material';
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
}

export default function StepStudents({
  studentFields,
  appendStudent,
  removeStudent,
  getValues,
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

  // Lấy schedules từ form
  const schedules =
    typeof window !== 'undefined' && getValues
      ? getValues('schedules') || []
      : [];
  const sessionOptions = schedules.map((schedule: any) => ({
    value: schedule.label,
    label: schedule.label,
  }));

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
  };

  const handleRemoveStudent = (index: number) => {
    removeStudent(index);
  };

  const getStudentById = (studentId: string) => {
    return (allStudents || []).find(student => student.id === studentId);
  };

  const getSessionName = (sessionId?: string) => {
    if (!sessionId) return 'Full buổi';

    const schedules =
      typeof window !== 'undefined' && getValues
        ? getValues('schedules') || []
        : [];
    const sessionIndex = parseInt(sessionId.split('-')[1]);

    if (sessionIndex >= 0 && schedules && sessionIndex < schedules.length) {
      return schedules[sessionIndex].label;
    }

    return 'Full buổi';
  };

  return (
    <Box display="flex" flexDirection="column" gap={4}>
      {/* Form thêm học sinh */}
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h6" mb={2}>
            Thêm học sinh
          </Typography>
          <Autocomplete
            multiple
            options={availableStudents}
            getOptionLabel={option =>
              option
                ? `${option.fullName || ''} - ${option.phoneNumber || ''}`
                : ''
            }
            value={selectedStudents}
            onChange={(_, newValue) => setSelectedStudents(newValue)}
            renderOption={(props, option) => (
              <Box component="li" {...props}>
                <Avatar
                  src={option?.avatar}
                  sx={{ width: 24, height: 24, mr: 1 }}
                >
                  <Person sx={{ fontSize: 14 }} />
                </Avatar>
                {option?.fullName || ''} - {option?.phoneNumber || ''}
              </Box>
            )}
            renderInput={params => (
              <TextField
                {...params}
                label="Chọn học sinh"
                size="small"
                fullWidth
                InputLabelProps={{ shrink: true }}
                disabled={loading}
                multiline
                minRows={2}
                maxRows={6}
                inputProps={{
                  ...params.inputProps,
                  placeholder:
                    !selectedStudents || selectedStudents.length === 0
                      ? loading
                        ? 'Đang tải...'
                        : 'Chọn một hoặc nhiều học sinh'
                      : '',
                }}
              />
            )}
            renderTags={(value, getTagProps) =>
              (value || []).map((option, index) => {
                const { key, ...chipProps } = getTagProps({ index });
                return (
                  <Chip
                    key={key}
                    label={`${option?.fullName || ''} - ${option?.phoneNumber || ''}`}
                    size="small"
                    avatar={
                      <Avatar
                        src={option?.avatar}
                        sx={{ width: 20, height: 20 }}
                      >
                        <Person sx={{ fontSize: 12 }} />
                      </Avatar>
                    }
                    {...chipProps}
                  />
                );
              })
            }
            sx={{
              mb: 2,
              '& .MuiAutocomplete-inputRoot': {
                minHeight: '80px',
                alignItems: 'flex-start',
                paddingTop: '8px',
                paddingBottom: '8px',
              },
              '& .MuiAutocomplete-tag': {
                margin: '2px',
              },
            }}
            loading={loading}
          />
          <RadioGroup
            row
            value={addType}
            onChange={e => setAddType(e.target.value as EStudentClassType)}
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
            <TextField
              select
              label="Chọn buổi học"
              value={addSession}
              onChange={e => setAddSession(e.target.value)}
              size="small"
              fullWidth
              sx={{ mb: 2 }}
              InputLabelProps={{ shrink: true }}
            >
              {(sessionOptions || []).map(
                (option: { value: string; label: string }) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                )
              )}
            </TextField>
          )}
          <Button
            fullWidth
            variant="contained"
            startIcon={<PersonAdd />}
            onClick={handleAddStudents}
            disabled={
              !selectedStudents ||
              (selectedStudents && selectedStudents.length === 0) ||
              (addType === EStudentClassType.HALF && !addSession) ||
              loading
            }
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
          <Typography variant="h6" mb={2}>
            Học sinh trong lớp ({(studentFields || []).length})
          </Typography>
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
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleRemoveStudent(index)}
                      >
                        <PersonRemove />
                      </IconButton>
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
