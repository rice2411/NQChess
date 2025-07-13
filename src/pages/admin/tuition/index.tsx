'use client';

import React, { useEffect, useState } from 'react';
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
  Tooltip,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
} from '@mui/material';
import { Add, CheckCircle, Warning, Refresh } from '@mui/icons-material';
import { TuitionService } from '@/services/tuition.service';
import { ClassService } from '@/services/class.service';
import {
  ITuitionFee,
  ETuitionStatus,
  ITuitionSummary,
} from '@/interfaces/tuition.interface';
import { IClass } from '@/interfaces/class.interface';
import { format, parseISO } from 'date-fns';
import { vi } from 'date-fns/locale';

export default function TuitionManagement() {
  const [tuitionFees, setTuitionFees] = useState<ITuitionFee[]>([]);
  const [classes, setClasses] = useState<IClass[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<string>('');
  const [selectedMonth, setSelectedMonth] = useState<string>('');
  const [summary, setSummary] = useState<ITuitionSummary | null>(null);

  const [snackbar, setSnackbar] = useState({ open: false, message: '' });
  const [loading, setLoading] = useState(false);

  // Confirm hook

  // Tạo danh sách tháng (12 tháng gần nhất)
  const generateMonthOptions = () => {
    const months = [];
    const currentDate = new Date();

    for (let i = 0; i < 12; i++) {
      const date = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - i,
        1
      );
      const monthStr =
        date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0');
      const monthLabel = format(date, 'MMMM yyyy', { locale: vi });
      months.push({ value: monthStr, label: monthLabel });
    }

    return months;
  };

  const monthOptions = generateMonthOptions();

  useEffect(() => {
    loadClasses();
    // Set default month to current month
    const currentMonth =
      new Date().getFullYear() +
      '-' +
      String(new Date().getMonth() + 1).padStart(2, '0');
    setSelectedMonth(currentMonth);
  }, []);

  useEffect(() => {
    if (selectedClassId && selectedMonth) {
      loadTuitionFees();
      loadSummary();
    }
  }, [selectedClassId, selectedMonth]);

  const loadClasses = async () => {
    try {
      setLoading(true);
      const result = await ClassService.getClasses(1, 1000);
      setClasses(result.classes);
    } catch (error) {
      console.error(error);
      setSnackbar({ open: true, message: 'Không thể tải danh sách lớp học' });
    } finally {
      setLoading(false);
    }
  };

  const loadTuitionFees = async () => {
    try {
      setLoading(true);
      const fees = await TuitionService.getTuitionByClassAndMonth(
        selectedClassId,
        selectedMonth
      );
      setTuitionFees(fees);
    } catch (error) {
      console.error(error);
      setSnackbar({ open: true, message: 'Không thể tải danh sách học phí' });
    } finally {
      setLoading(false);
    }
  };

  const loadSummary = async () => {
    try {
      const summaryData = await TuitionService.getTuitionSummary(
        selectedClassId,
        selectedMonth
      );
      setSummary(summaryData);
    } catch (error) {
      console.error('Lỗi khi tải tổng kết học phí:', error);
    }
  };

  const handleUpdateStatus = async (
    tuitionId: string,
    status: ETuitionStatus,
    paidAmount?: number
  ) => {
    try {
      setLoading(true);
      await TuitionService.updateTuitionStatus(
        tuitionId,
        status,
        paidAmount,
        status === ETuitionStatus.PAID ? new Date().toISOString() : undefined
      );
      setSnackbar({ open: true, message: 'Cập nhật trạng thái thành công!' });
      loadTuitionFees();
      loadSummary();
    } catch (error) {
      console.error(error);
      setSnackbar({ open: true, message: 'Có lỗi khi cập nhật trạng thái' });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTuition = async () => {
    if (!selectedClassId || !selectedMonth) {
      setSnackbar({ open: true, message: 'Vui lòng chọn lớp và tháng' });
      return;
    }

    try {
      setLoading(true);
      await TuitionService.createTuitionForClass(
        selectedClassId,
        selectedMonth
      );
      setSnackbar({ open: true, message: 'Tạo học phí thành công!' });
      loadTuitionFees();
      loadSummary();
    } catch (error) {
      console.error(error);
      setSnackbar({ open: true, message: 'Có lỗi khi tạo học phí' });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: ETuitionStatus) => {
    switch (status) {
      case ETuitionStatus.PAID:
        return 'success';
      case ETuitionStatus.PENDING:
        return 'warning';
      case ETuitionStatus.OVERDUE:
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status: ETuitionStatus) => {
    switch (status) {
      case ETuitionStatus.PAID:
        return 'Đã đóng';
      case ETuitionStatus.PENDING:
        return 'Chưa đóng';
      case ETuitionStatus.OVERDUE:
        return 'Quá hạn';
      default:
        return 'Không xác định';
    }
  };

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('vi-VN') + ' đ';
  };

  return (
    <Container maxWidth={false} sx={{ mt: 4, mx: 0, width: '100%' }}>
      <Typography variant="h4" fontWeight={700} color="primary" mb={3}>
        Quản lý học phí
      </Typography>

      {/* Filters */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, alignItems: 'center' }}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel sx={{ pb: 2, top: -5 }}>Lớp học</InputLabel>
          <Select
            value={selectedClassId}
            label="Lớp học"
            onChange={e => setSelectedClassId(e.target.value)}
            sx={{
              '& .MuiSelect-select': {
                pt: 1,
                pb: 1,
              },
            }}
          >
            {classes.map(cls => (
              <MenuItem key={cls.id} value={cls.id}>
                {cls.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel sx={{ pb: 2, top: -5 }}>Tháng</InputLabel>
          <Select
            value={selectedMonth}
            label="Tháng"
            onChange={e => setSelectedMonth(e.target.value)}
            sx={{
              '& .MuiSelect-select': {
                pt: 1,
                pb: 1,
              },
            }}
          >
            {monthOptions.map(month => (
              <MenuItem key={month.value} value={month.value}>
                {month.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleCreateTuition}
          disabled={!selectedClassId || !selectedMonth || loading}
        >
          Tạo học phí
        </Button>

        <Button
          variant="outlined"
          startIcon={<Refresh />}
          onClick={() => {
            if (selectedClassId && selectedMonth) {
              loadTuitionFees();
              loadSummary();
            }
          }}
          disabled={loading}
        >
          Làm mới
        </Button>
      </Box>

      {/* Summary Cards */}
      {summary && (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: 2,
            mb: 3,
          }}
        >
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Tổng học sinh
              </Typography>
              <Typography variant="h4" component="div">
                {summary.totalStudents}
              </Typography>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Tổng học phí
              </Typography>
              <Typography variant="h4" component="div" color="primary">
                {formatCurrency(summary.totalAmount)}
              </Typography>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Đã đóng
              </Typography>
              <Typography variant="h4" component="div" color="success.main">
                {formatCurrency(summary.paidAmount)}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {summary.paidCount} học sinh
              </Typography>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Chưa đóng
              </Typography>
              <Typography variant="h4" component="div" color="warning.main">
                {formatCurrency(summary.pendingAmount)}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {summary.pendingCount} học sinh
              </Typography>
            </CardContent>
          </Card>
        </Box>
      )}

      {/* Tuition Fees Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Học sinh</TableCell>
              <TableCell>Tháng</TableCell>
              <TableCell>Số tiền</TableCell>
              <TableCell>Đã đóng</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell>Hạn đóng</TableCell>
              <TableCell align="right">Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tuitionFees.map(fee => (
              <TableRow key={fee.id}>
                <TableCell>
                  <Typography fontWeight={600}>{fee.studentName}</Typography>
                </TableCell>
                <TableCell>
                  {format(parseISO(`${fee.month}-01`), 'MMMM yyyy', {
                    locale: vi,
                  })}
                </TableCell>
                <TableCell>
                  <Typography fontWeight={600} color="primary">
                    {formatCurrency(fee.amount)}
                  </Typography>
                </TableCell>
                <TableCell>{formatCurrency(fee.paidAmount)}</TableCell>
                <TableCell>
                  <Chip
                    label={getStatusLabel(fee.status)}
                    color={getStatusColor(fee.status) as any}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  {fee.dueDate
                    ? format(parseISO(fee.dueDate), 'dd/MM/yyyy')
                    : '-'}
                </TableCell>
                <TableCell align="right">
                  {fee.status === ETuitionStatus.PENDING && (
                    <Tooltip title="Đánh dấu đã đóng">
                      <IconButton
                        color="success"
                        onClick={() =>
                          handleUpdateStatus(
                            fee.id,
                            ETuitionStatus.PAID,
                            fee.amount
                          )
                        }
                        disabled={loading}
                      >
                        <CheckCircle />
                      </IconButton>
                    </Tooltip>
                  )}
                  {fee.status === ETuitionStatus.PAID && (
                    <Tooltip title="Đánh dấu chưa đóng">
                      <IconButton
                        color="warning"
                        onClick={() =>
                          handleUpdateStatus(fee.id, ETuitionStatus.PENDING, 0)
                        }
                        disabled={loading}
                      >
                        <Warning />
                      </IconButton>
                    </Tooltip>
                  )}
                </TableCell>
              </TableRow>
            ))}
            {tuitionFees.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  {selectedClassId && selectedMonth
                    ? 'Không có học phí nào cho tháng này'
                    : 'Vui lòng chọn lớp và tháng để xem học phí'}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ open: false, message: '' })}
        message={snackbar.message}
      />
    </Container>
  );
}
