'use client';

import React from 'react';
import { Box, Typography, Paper, Chip } from '@mui/material';
import { Schedule as ScheduleIcon } from '@mui/icons-material';

interface AttendanceRecord {
  date: string;
  status: string;
  sessionTime?: string;
  note?: string;
}

interface AttendanceHistoryProps {
  recentAttendance: AttendanceRecord[];
  className?: string;
  classSchedule?: string;
}

const AttendanceHistory: React.FC<AttendanceHistoryProps> = ({
  recentAttendance,
  className = 'Lớp cờ vua',
  classSchedule = 'Chưa có lịch',
}) => {
  const getStatusColor = (status: string) => {
    const isPresent = status === 'PRESENT' || status === 'Có mặt';
    const isLate = status === 'LATE' || status === 'Đi muộn';
    const isExcused = status === 'EXCUSED' || status === 'Có phép';

    if (isPresent) return '#4caf50';
    if (isLate) return '#ff9800';
    if (isExcused) return '#2196f3';
    return '#f44336';
  };

  const getStatusText = (status: string) => {
    if (status === 'PRESENT' || status === 'Có mặt') return 'Có mặt';
    if (status === 'LATE' || status === 'Đi muộn') return 'Đi muộn';
    if (status === 'EXCUSED' || status === 'Có phép') return 'Có phép';
    return 'Vắng';
  };

  const getStatusIcon = (status: string) => {
    if (status === 'PRESENT' || status === 'Có mặt') return '✓';
    if (status === 'LATE' || status === 'Đi muộn') return '⏰';
    if (status === 'EXCUSED' || status === 'Có phép') return '📝';
    return '✗';
  };

  const getStatusDescription = (status: string) => {
    if (status === 'PRESENT' || status === 'Có mặt') return 'Đi học đầy đủ';
    if (status === 'LATE' || status === 'Đi muộn') return 'Đi muộn';
    if (status === 'EXCUSED' || status === 'Có phép') return 'Có phép vắng';
    return 'Vắng không phép';
  };

  const calculateStats = () => {
    const stats = {
      present: recentAttendance.filter(
        a => a.status === 'PRESENT' || a.status === 'Có mặt'
      ).length,
      late: recentAttendance.filter(
        a => a.status === 'LATE' || a.status === 'Đi muộn'
      ).length,
      absent: recentAttendance.filter(
        a => a.status === 'ABSENT' || a.status === 'Vắng'
      ).length,
      excused: recentAttendance.filter(
        a => a.status === 'EXCUSED' || a.status === 'Có phép'
      ).length,
    };
    return stats;
  };

  const stats = calculateStats();

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 2,
        }}
      >
        <Typography variant="h6" fontWeight={600}>
          Lịch sử điểm danh gần đây
        </Typography>
        <Chip
          label={`${recentAttendance.length} buổi học`}
          size="small"
          color="primary"
          variant="outlined"
        />
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        {recentAttendance.map((attendance, index) => {
          const statusColor = getStatusColor(attendance.status);

          return (
            <Paper
              key={index}
              elevation={0}
              sx={{
                p: 2.5,
                borderRadius: 3,
                border: '1px solid',
                borderColor: 'grey.200',
                backgroundColor: 'white',
                position: 'relative',
                overflow: 'hidden',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  borderColor: statusColor,
                },
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: 4,
                  backgroundColor: statusColor,
                  borderRadius: '0 2px 2px 0',
                },
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 2,
                }}
              >
                {/* Icon trạng thái */}
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    backgroundColor: `${statusColor}15`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: statusColor,
                    fontSize: '18px',
                    fontWeight: 'bold',
                    flexShrink: 0,
                  }}
                >
                  {getStatusIcon(attendance.status)}
                </Box>

                {/* Thông tin chính */}
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  {/* Header - Tên lớp và ngày */}
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      mb: 1.5,
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        flexWrap: 'wrap',
                      }}
                    >
                      <Typography variant="h6" fontWeight={600} color="primary">
                        {className}
                      </Typography>
                      <Chip
                        label={`Buổi ${recentAttendance.length - index}`}
                        size="small"
                        variant="outlined"
                        color="primary"
                        sx={{ fontSize: '0.75rem' }}
                      />
                    </Box>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      fontWeight={500}
                    >
                      Ngày {attendance.date}
                    </Typography>
                  </Box>

                  {/* Thời gian buổi học */}
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      mb: 1.5,
                    }}
                  >
                    <ScheduleIcon
                      fontSize="small"
                      sx={{ color: 'text.secondary' }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      {attendance.sessionTime || classSchedule}
                    </Typography>
                  </Box>

                  {/* Trạng thái điểm danh */}
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      mb: 1.5,
                    }}
                  >
                    <Chip
                      label={getStatusText(attendance.status)}
                      size="small"
                      sx={{
                        backgroundColor: `${statusColor}15`,
                        color: statusColor,
                        fontWeight: 600,
                        '& .MuiChip-label': {
                          px: 1.5,
                        },
                      }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      •
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {getStatusDescription(attendance.status)}
                    </Typography>
                  </Box>

                  {/* Ghi chú của giáo viên */}
                  {attendance.note && (
                    <Box
                      sx={{
                        mt: 1.5,
                        p: 1.5,
                        backgroundColor: 'grey.50',
                        borderRadius: 2,
                        border: '1px solid',
                        borderColor: 'grey.200',
                      }}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: 1,
                        }}
                      >
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ fontWeight: 500 }}
                        >
                          📝
                        </Typography>
                        <Box sx={{ flex: 1 }}>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ fontWeight: 500, mb: 0.5 }}
                          >
                            Ghi chú của giáo viên:
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.primary"
                            sx={{
                              fontStyle: 'italic',
                              lineHeight: 1.4,
                            }}
                          >
                            {attendance.note}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  )}

                  {/* Thông tin bổ sung nếu không có ghi chú */}
                  {!attendance.note && (
                    <Box
                      sx={{
                        mt: 1.5,
                        p: 1.5,
                        backgroundColor: 'grey.50',
                        borderRadius: 2,
                        border: '1px solid',
                        borderColor: 'grey.200',
                      }}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                        }}
                      >
                        <Typography variant="body2" color="text.secondary">
                          ℹ️
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Không có ghi chú từ giáo viên
                        </Typography>
                      </Box>
                    </Box>
                  )}
                </Box>
              </Box>
            </Paper>
          );
        })}
      </Box>

      {/* Thống kê nhanh */}
      {recentAttendance.length > 0 && (
        <Box sx={{ mt: 3 }}>
          <Paper
            elevation={0}
            sx={{
              p: 2,
              backgroundColor: 'grey.50',
              borderRadius: 3,
              border: '1px solid',
              borderColor: 'grey.200',
            }}
          >
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Tóm tắt {recentAttendance.length} buổi gần nhất:
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              {stats.present > 0 && (
                <Chip
                  label={`${stats.present} có mặt`}
                  size="small"
                  sx={{
                    backgroundColor: '#4caf5015',
                    color: '#4caf50',
                  }}
                />
              )}
              {stats.late > 0 && (
                <Chip
                  label={`${stats.late} đi muộn`}
                  size="small"
                  sx={{
                    backgroundColor: '#ff980015',
                    color: '#ff9800',
                  }}
                />
              )}
              {stats.absent > 0 && (
                <Chip
                  label={`${stats.absent} vắng`}
                  size="small"
                  sx={{
                    backgroundColor: '#f4433615',
                    color: '#f44336',
                  }}
                />
              )}
              {stats.excused > 0 && (
                <Chip
                  label={`${stats.excused} có phép`}
                  size="small"
                  sx={{
                    backgroundColor: '#2196f315',
                    color: '#2196f3',
                  }}
                />
              )}
            </Box>
          </Paper>
        </Box>
      )}
    </Box>
  );
};

export default AttendanceHistory;
