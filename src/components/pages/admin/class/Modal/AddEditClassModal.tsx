import React, { useEffect, useState, useMemo } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stepper,
  Step,
  StepLabel,
  Typography,
  Alert,
  Box,
} from '@mui/material';
import { useForm, useFieldArray, useWatch } from 'react-hook-form';
import dynamic from 'next/dynamic';
import {
  EClassStatus,
  IClass,
  IStudentClass,
} from '@/interfaces/class.interface';
import { parseVND } from '@/utils/format';
import { format, parse } from 'date-fns';

/**
 * Modal quản lý lớp học đa bước (Stepper)
 *
 * Cấu trúc 3 bước:
 * 1. StepClassInfo: Thông tin cơ bản của lớp (tên, học phí, trạng thái, ngày bắt đầu, ngày kết thúc)
 * 2. StepSchedules: Quản lý lịch học (giờ bắt đầu, kết thúc, thứ, buổi học)
 * 3. StepStudents: Quản lý học sinh trong lớp (thêm/xóa/cập nhật học sinh)
 *
 * Tính năng:
 * - Sử dụng react-hook-form với useFieldArray
 * - Validation từng bước và tổng thể
 * - UI/UX hiện đại với Material-UI
 * - Không cho phép skip step, chỉ điều hướng bằng nút
 * - Responsive design
 * - DatePicker cho ngày bắt đầu và kết thúc lớp học
 * - Validation cho việc sửa lớp học (không cho phép thay đổi schedule khi lớp đang học/đã kết thúc)
 */

export interface ClassFormValues {
  name: string;
  tuition: string;
  status: EClassStatus;
  startDate: Date;
  endDate?: Date;
  startTime: Date;
  endTime: Date;
  weekday: string;
  schedules: { label: string }[];
  students: IStudentClass[];
}

interface AddEditClassModalProps {
  open: boolean;
  editing: IClass | null;
  onClose: () => void;
  onSave: (data: Partial<IClass>) => void;
  loading?: boolean;
}

// Dynamic imports để tránh SSR issues
const DynamicStepClassInfo = dynamic(() => import('./Steps/StepClassInfo'), {
  ssr: false,
});
const DynamicStepSchedules = dynamic(() => import('./Steps/StepSchedules'), {
  ssr: false,
});
const DynamicStepStudents = dynamic(() => import('./Steps/StepStudents'), {
  ssr: false,
});

export default function AddEditClassModal({
  open,
  editing,
  onClose,
  onSave,
  loading,
}: AddEditClassModalProps) {
  const steps = ['Thông tin lớp', 'Buổi học', 'Học sinh'];
  const [activeStep, setActiveStep] = React.useState(0);
  const [isClient, setIsClient] = useState(false);

  // React Hook Form setup
  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    trigger,
    formState: { errors },
  } = useForm<ClassFormValues>({
    defaultValues: {
      name: '',
      tuition: '',
      status: EClassStatus.NOT_STARTED,
      startDate: typeof window !== 'undefined' ? new Date() : new Date(0),
      endDate: undefined,
      startTime: new Date(0, 0, 0, 0, 0), // 00:00
      endTime: new Date(0, 0, 0, 23, 59), // 23:59
      weekday: 'Thứ 2',
      schedules: [],
      students: [],
    },
    mode: 'onChange', // Validate real-time
  });

  // Watch form values để trigger re-render khi values thay đổi
  const watchedValues = useWatch({
    control,
    name: ['name', 'tuition', 'startDate', 'endDate', 'schedules'],
  });
  const {
    fields: scheduleFields,
    append: appendSchedule,
    remove: removeSchedule,
  } = useFieldArray({ control, name: 'schedules' } as any);
  const {
    fields: studentFields,
    append: appendStudent,
    remove: removeStudent,
    update: updateStudent,
  } = useFieldArray({ control, name: 'students' });

  // Kiểm tra client-side
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Populate form data when editing
  useEffect(() => {
    if (!isClient) return;

    if (editing && open) {
      // Set basic class info
      setValue('name', editing.name || '');
      setValue('tuition', editing.tuition?.toString() || '');
      setValue('status', editing.status || EClassStatus.NOT_STARTED);

      // Set start date
      if (editing.startDate) {
        const startDate =
          typeof editing.startDate === 'string'
            ? parse(editing.startDate, 'yyyy-MM-dd', new Date())
            : editing.startDate;
        setValue('startDate', startDate);
      }

      // Set end date
      if (editing.endDate) {
        const endDate =
          typeof editing.endDate === 'string'
            ? parse(editing.endDate, 'yyyy-MM-dd', new Date())
            : editing.endDate;
        setValue('endDate', endDate);
      } else {
        setValue('endDate', undefined);
      }

      // Set schedules
      if (editing.schedules && editing.schedules.length > 0) {
        const scheduleFields = editing.schedules.map(schedule => ({
          label: schedule,
        }));
        setValue('schedules', scheduleFields);
      }

      // Set students
      if (editing.students && editing.students.length > 0) {
        setValue('students', editing.students);
      }

      // Reset active step to 0 when editing
      setActiveStep(0);
    } else if (!editing && open) {
      // Reset form when adding new class
      setValue('name', '');
      setValue('tuition', '');
      setValue('status', EClassStatus.NOT_STARTED);
      setValue(
        'startDate',
        typeof window !== 'undefined' ? new Date() : new Date(0)
      );
      setValue('endDate', undefined);
      setValue('schedules', []);
      setValue('students', []);
      setActiveStep(0);
    }
  }, [editing, open, setValue, isClient]);

  const handleNext = async () => {
    if (activeStep === 0) {
      const isValid = await trigger([
        'name',
        'tuition',
        'startDate',
        'endDate',
      ]);
      if (!isValid) {
        return;
      }
    } else if (activeStep === 1) {
      const currentValues = getValues();
      if (!currentValues.schedules || currentValues.schedules.length === 0) {
        return;
      }
    }

    setActiveStep(prev => prev + 1);
  };

  // Kiểm tra xem bước hiện tại có thể chuyển tiếp không
  const canProceed = useMemo(() => {
    if (activeStep === 0) {
      const [name, tuition, startDate] = watchedValues;
      const requiredFieldsValid =
        !errors.name && !errors.tuition && !errors.startDate && !errors.endDate;
      const hasRequiredValues = name?.trim() && tuition && startDate;

      return requiredFieldsValid && hasRequiredValues;
    }

    if (activeStep === 1) {
      const schedules = watchedValues[4]; // schedules là index thứ 5
      return schedules && schedules.length > 0;
    }

    return true;
  }, [
    activeStep,
    watchedValues,
    errors.name,
    errors.tuition,
    errors.startDate,
    errors.endDate,
  ]);

  const handleBack = () => setActiveStep(prev => prev - 1);

  // Kiểm tra xem có thể thay đổi schedule không
  const canModifySchedule = useMemo(() => {
    if (!editing) return true; // Tạo mới thì được thay đổi
    return editing.status === EClassStatus.NOT_STARTED;
  }, [editing]);

  // Kiểm tra xem có thể xóa học sinh không
  const canRemoveStudents = useMemo(() => {
    if (!editing) return true; // Tạo mới thì được xóa
    return editing.status === EClassStatus.NOT_STARTED;
  }, [editing]);

  const onSubmit = (data: ClassFormValues) => {
    const tuitionValue =
      typeof data.tuition === 'string'
        ? parseInt(parseVND(data.tuition))
        : data.tuition;

    // Convert schedules từ {label: string}[] thành string[]
    const schedulesStrings = (data.schedules || []).map(
      schedule => schedule.label
    );

    // Clean students data - loại bỏ session undefined
    const cleanStudents = (data.students || []).map(student => {
      const cleanStudent = { ...student };
      if (cleanStudent.session === undefined) {
        delete cleanStudent.session;
      }
      return cleanStudent;
    });

    // Loại bỏ các field undefined để tránh lỗi Firebase
    const cleanData: Partial<IClass> = {
      name: data.name,
      tuition: tuitionValue,
      startDate: format(data.startDate, 'yyyy-MM-dd'),
      status: data.status,
      schedules: schedulesStrings,
      students: cleanStudents,
    };

    // Thêm endDate nếu có
    if (data.endDate) {
      cleanData.endDate = format(data.endDate, 'yyyy-MM-dd');
    }

    // Filter out undefined values
    const filteredData = Object.fromEntries(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      Object.entries(cleanData).filter(([_, value]) => value !== undefined)
    );

    onSave(filteredData);
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      disableScrollLock
    >
      <DialogTitle>
        <Box>
          {editing ? `Chỉnh sửa lớp: ${editing.name}` : 'Thêm lớp học mới'}
        </Box>
        <Stepper activeStep={activeStep} sx={{ mt: 2 }}>
          {steps.map(label => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </DialogTitle>
      <DialogContent
        sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 2 }}
      >
        {/* Warning for editing active/ended classes */}
        {editing && editing.status !== EClassStatus.NOT_STARTED && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            <Typography variant="body2">
              ⚠️ <strong>Lưu ý:</strong> Lớp học này đang{' '}
              {editing.status === EClassStatus.ACTIVE ? 'học' : 'đã kết thúc'}.
              {!canModifySchedule && ' Không thể thay đổi lịch học.'}
              {!canRemoveStudents &&
                ' Không thể xóa học sinh (chỉ được thêm mới).'}
            </Typography>
          </Alert>
        )}

        {activeStep === 0 && isClient && (
          <DynamicStepClassInfo control={control} errors={errors} />
        )}
        {activeStep === 1 && isClient && (
          <DynamicStepSchedules
            control={control}
            errors={errors}
            scheduleFields={scheduleFields}
            appendSchedule={appendSchedule}
            removeSchedule={removeSchedule}
            canModify={canModifySchedule}
          />
        )}
        {activeStep === 2 && isClient && (
          <DynamicStepStudents
            control={control}
            errors={errors}
            studentFields={studentFields}
            appendStudent={appendStudent}
            removeStudent={removeStudent}
            updateStudent={updateStudent}
            setValue={setValue}
            getValues={getValues}
            canRemoveStudents={canRemoveStudents}
          />
        )}
      </DialogContent>
      <DialogActions>
        {activeStep > 0 && <Button onClick={handleBack}>Quay lại</Button>}
        <Box sx={{ flex: 1 }} />
        <Button onClick={handleCancel} color="inherit">
          Hủy
        </Button>
        {activeStep < steps.length - 1 && (
          <Button
            onClick={handleNext}
            variant="contained"
            disabled={!canProceed}
            sx={{ minWidth: 100 }}
          >
            Tiếp
          </Button>
        )}
        {activeStep === steps.length - 1 && (
          <Button
            onClick={handleSubmit(onSubmit)}
            variant="contained"
            disabled={loading}
            sx={{ minWidth: 100 }}
          >
            {editing ? 'Lưu' : 'Thêm'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
