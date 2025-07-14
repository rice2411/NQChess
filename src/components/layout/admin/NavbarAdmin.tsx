'use client';
import {
  AppBar,
  Toolbar,
  Typography,
  Paper,
  InputBase,
  IconButton,
  Badge,
  Avatar,
  useTheme,
} from '@mui/material';
import { Search, CalendarToday, Notifications } from '@mui/icons-material';

export default function NavbarAdmin() {
  const theme = useTheme();
  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        bgcolor: '#fff',
        color: 'text.primary',
        borderBottom: `1px solid ${theme.palette.divider}`,
        boxShadow: 'none',
        zIndex: theme.zIndex.drawer + 1,
        width: `calc(100% - 250px)`, // Trừ đi width của sidebar
        left: '250px', // Offset bằng width của sidebar
      }}
    >
      <Toolbar sx={{ height: 64, gap: 2 }}>
        <Typography
          variant="h5"
          fontWeight={700}
          color="primary"
          sx={{ flexGrow: 1 }}
        >
          Admin Overview
        </Typography>
        <Paper
          component="form"
          sx={{
            display: 'flex',
            alignItems: 'center',
            width: 240,
            px: 1,
            py: 0.5,
            borderRadius: 2,
            boxShadow: 'none',
            bgcolor: theme.palette.grey[100],
          }}
          elevation={0}
        >
          <Search color="action" sx={{ mr: 1 }} />
          <InputBase placeholder="Search..." sx={{ flex: 1, fontSize: 15 }} />
        </Paper>
        <IconButton>
          <CalendarToday color="action" />
        </IconButton>
        <IconButton>
          <Badge color="error" variant="dot">
            <Notifications color="action" />
          </Badge>
        </IconButton>
        <Avatar
          src="https://randomuser.me/api/portraits/women/44.jpg"
          sx={{ width: 32, height: 32, ml: 2 }}
        />
      </Toolbar>
    </AppBar>
  );
}
