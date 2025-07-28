'use client';

import {
  Box,
  List,
  Typography,
  Divider,
  ListItem,
  ListItemText,
  Button,
  Grid,
  Card,
  Container,
  useTheme,
  Alert,
} from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import ClassIcon from '@mui/icons-material/Class';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import PostAddIcon from '@mui/icons-material/PostAdd';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { useState } from 'react';
import ResetDataModal from '@/components/pages/admin/dashboard/Modal/ResetDataModal';

const stats = [
  {
    label: 'Học sinh',
    value: 120,
    icon: <PeopleIcon color="primary" />,
    color: 'primary.main',
  },
  {
    label: 'Lớp học',
    value: 8,
    icon: <ClassIcon color="primary" />,
    color: 'primary.main',
  },
  {
    label: 'Học phí tháng này',
    value: '25.000.000đ',
    icon: <AttachMoneyIcon color="primary" />,
    color: 'primary.main',
  },
  {
    label: 'Bài đăng',
    value: 15,
    icon: <PostAddIcon color="primary" />,
    color: 'primary.main',
  },
  {
    label: 'Điểm danh',
    value: 32,
    icon: <EventAvailableIcon color="primary" />,
    color: 'primary.main',
  },
  {
    label: 'Vắng mặt',
    value: 4,
    icon: <WarningAmberIcon color="warning" />,
    color: 'warning.main',
  },
  {
    label: 'Chưa đóng học phí',
    value: 6,
    icon: <TrendingDownIcon color="error" />,
    color: 'error.main',
  },
];

const recentPosts = [
  { title: 'Lịch học tuần này', date: '2024-06-01' },
  { title: 'Thông báo đóng học phí tháng 6', date: '2024-05-28' },
  { title: 'Kết quả giải đấu nội bộ', date: '2024-05-25' },
];

export default function DashboardPage() {
  const theme = useTheme();
  const [openResetModal, setOpenResetModal] = useState(false);

  const handleOpenResetModal = () => {
    setOpenResetModal(true);
  };

  const handleCloseResetModal = () => {
    setOpenResetModal(false);
  };

  return (
    <Box sx={{ flexGrow: 1, minHeight: '100vh', pt: 0 }}>
      <Container maxWidth="xl" sx={{ mt: 2, mb: 2 }}>
        <Typography variant="h4" fontWeight={700} color="primary" mb={3}>
          Tổng quan quản trị lớp học cờ vua
        </Typography>

        {/* Alert cảnh báo về nút reset */}
        <Alert
          severity="warning"
          sx={{ mb: 3 }}
          action={
            <Button
              color="error"
              size="small"
              variant="outlined"
              startIcon={<DeleteForeverIcon />}
              onClick={handleOpenResetModal}
            >
              Reset Data
            </Button>
          }
        >
          <Typography variant="body2">
            <strong>Cảnh báo:</strong> Nút Reset Data sẽ xóa toàn bộ dữ liệu
            trong hệ thống (trừ dữ liệu người dùng). Chỉ sử dụng khi cần thiết!
          </Typography>
        </Alert>

        <Grid container spacing={3}>
          {stats.map(stat => (
            <Grid
              key={stat.label}
              sx={{
                display: 'flex',
                flex: 1,
                minWidth: 'max-content',
                width: '400px',
              }}
            >
              <Card
                sx={{
                  flex: 1,
                  minWidth: 0,
                  p: 2,
                  borderRadius: 3,
                  boxShadow: 'none',
                  border: `1px solid ${theme.palette.divider}`,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  {stat.icon}
                  <Typography
                    variant="h5"
                    fontWeight={700}
                    color={stat.color}
                    sx={{ ml: 1 }}
                  >
                    {stat.value}
                  </Typography>
                </Box>
                <Typography
                  fontSize={15}
                  color="text.secondary"
                  fontWeight={600}
                >
                  {stat.label}
                </Typography>
              </Card>
            </Grid>
          ))}
          {/* Card bài đăng mới */}
          <Grid component="div" sx={{ xs: 12, sm: 6, md: 3 }}>
            <Card
              sx={{
                p: 2,
                borderRadius: 3,
                boxShadow: 'none',
                border: `1px solid ${theme.palette.divider}`,
                height: '100%',
              }}
            >
              <Typography fontWeight={700} fontSize={16} mb={1}>
                Bài đăng mới nhất
              </Typography>
              <Divider sx={{ mb: 1 }} />
              <List>
                {recentPosts.map((post, idx) => (
                  <ListItem key={idx} disablePadding>
                    <ListItemText
                      primary={post.title}
                      secondary={post.date}
                      primaryTypographyProps={{ fontWeight: 600 }}
                    />
                  </ListItem>
                ))}
              </List>
              <Button
                variant="contained"
                color="primary"
                sx={{ mt: 2, borderRadius: 2 }}
                fullWidth
              >
                Xem tất cả bài đăng
              </Button>
            </Card>
          </Grid>
          {/* Card biểu đồ placeholder */}
          <Grid component="div" sx={{ xs: 12, sm: 6, md: 3 }}>
            <Card
              sx={{
                p: 3,
                borderRadius: 3,
                boxShadow: 'none',
                border: `1px solid ${theme.palette.divider}`,
              }}
            >
              <Typography fontWeight={700} fontSize={16} mb={2}>
                Biểu đồ học sinh theo lớp
              </Typography>
              <Box
                sx={{
                  height: 220,
                  borderRadius: 2,
                  bgcolor: theme.palette.grey[100],
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'text.disabled',
                }}
              >
                (Chart placeholder)
              </Box>
            </Card>
          </Grid>
        </Grid>
      </Container>
      <ResetDataModal open={openResetModal} onClose={handleCloseResetModal} />
    </Box>
  );
}
