import {
  Drawer,
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Avatar,
  Typography,
  useTheme,
  alpha,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import ClassIcon from '@mui/icons-material/Class';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import PostAddIcon from '@mui/icons-material/PostAdd';
import BarChartIcon from '@mui/icons-material/BarChart';
import SettingsIcon from '@mui/icons-material/Settings';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import { usePathname } from 'next/navigation';
import { ROUTES_ADMIN } from '@/constants/routes';

const DRAWER_WIDTH = 250;

const mainMenu = [
  { label: 'Tổng quan', icon: <DashboardIcon />, path: ROUTES_ADMIN.DASHBOARD },
  { label: 'Học sinh', icon: <PeopleIcon />, path: ROUTES_ADMIN.STUDENTS },
  { label: 'Lớp học', icon: <ClassIcon />, path: ROUTES_ADMIN.CLASSES },
  {
    label: 'Điểm danh',
    icon: <EventAvailableIcon />,
    path: ROUTES_ADMIN.ATTENDANCE,
  },
  { label: 'Học phí', icon: <AttachMoneyIcon />, path: ROUTES_ADMIN.TUITION },
  { label: 'Bài đăng', icon: <PostAddIcon />, path: ROUTES_ADMIN.POSTS },
  { label: 'Báo cáo', icon: <BarChartIcon />, path: ROUTES_ADMIN.REPORTS },
];
const subMenu = [
  { label: 'Cài đặt', icon: <SettingsIcon />, path: ROUTES_ADMIN.SETTINGS },
  {
    label: 'Tài khoản',
    icon: <AccountCircleIcon />,
    path: ROUTES_ADMIN.ACCOUNT,
  },
  { label: 'Đăng xuất', icon: <LogoutIcon />, path: ROUTES_ADMIN.LOGOUT },
];

export default function SidebarAdmin() {
  const theme = useTheme();
  const pathname = usePathname();
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: DRAWER_WIDTH,
          boxSizing: 'border-box',
          borderRight: `1px solid ${theme.palette.divider}`,
          bgcolor: '#fff',
          p: 0,
        },
      }}
      open
    >
      <Box
        sx={{
          p: 2,
          pb: 1,
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          height: 64,
          bgcolor: '#fff',
        }}
      >
        <Avatar
          sx={{ width: 36, height: 36, bgcolor: theme.palette.primary.main }}
        >
          NQ
        </Avatar>
        <Box>
          <Typography fontWeight={700} color="primary.main" fontSize={18}>
            Quản trị
          </Typography>
          <Typography fontSize={12} color="text.secondary">
            Lớp học cờ vua
          </Typography>
        </Box>
      </Box>
      <Divider sx={{ mb: 1 }} />
      <List>
        {mainMenu.map(item => (
          <ListItem key={item.label} disablePadding>
            <ListItemButton
              selected={pathname === item.path}
              sx={{
                borderRadius: 2,
                mx: 1,
                my: 0.5,
                color: pathname === item.path ? 'primary.main' : 'text.primary',
                fontWeight: pathname === item.path ? 700 : 500,
                '&.Mui-selected, &.Mui-selected:hover': {
                  bgcolor: alpha(theme.palette.primary.main, 0.08),
                  color: 'primary.main',
                  fontWeight: 700,
                  '& .MuiListItemIcon-root': {
                    color: 'primary.main',
                  },
                  '& .MuiListItemText-primary': {
                    color: 'primary.main',
                  },
                },
                '&:hover': {
                  bgcolor: alpha(theme.palette.primary.main, 0.12),
                  color: 'primary.main',
                  '& .MuiListItemIcon-root': {
                    color: 'primary.main',
                  },
                  '& .MuiListItemText-primary': {
                    color: 'primary.main',
                  },
                },
              }}
              href={item.path}
            >
              <ListItemIcon
                sx={{
                  color:
                    pathname === item.path ? 'primary.main' : 'text.secondary',
                  transition: 'color 0.2s',
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider sx={{ my: 1 }} />
      <List>
        {subMenu.map(item => (
          <ListItem key={item.label} disablePadding>
            <ListItemButton
              selected={pathname === item.path}
              sx={{ borderRadius: 2, mx: 1, my: 0.5 }}
              href={item.path}
            >
              <ListItemIcon sx={{ color: 'text.secondary' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
}
