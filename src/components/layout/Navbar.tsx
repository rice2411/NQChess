'use client';

import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Button,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Tooltip,
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import OndemandVideoIcon from '@mui/icons-material/OndemandVideo';
import StorefrontIcon from '@mui/icons-material/Storefront';
import GroupsIcon from '@mui/icons-material/Groups';
import LogoutIcon from '@mui/icons-material/Logout';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PersonIcon from '@mui/icons-material/Person';
import { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import { useAuthStore } from '@/store/useAuthStore';
import { signOutUser } from '@/lib/firebase-auth';
import { useRouter } from 'next/navigation';
import { AccountCircle } from '@mui/icons-material';

export default function Navbar() {
  const theme = useTheme();
  const [mounted, setMounted] = useState(false);

  const user = useAuthStore(state => state.user);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const router = useRouter();

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render until mounted
  if (!mounted) {
    return (
      <AppBar
        position="fixed"
        color="inherit"
        elevation={1}
        sx={{ zIndex: 1201 }}
      >
        <Toolbar sx={{ minHeight: { xs: 44, sm: 52 }, padding: 0 }}>
          <Typography
            variant="h6"
            sx={{
              position: 'absolute',
              fontWeight: 700,
              color: theme.palette.primary.main,
              whiteSpace: 'nowrap',
              fontSize: { xs: 14, sm: 18 },
            }}
          >
            Như Quỳnh Chess
          </Typography>
        </Toolbar>
      </AppBar>
    );
  }

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    await signOutUser();
    handleMenuClose();
  };

  const handleLoginClick = () => {
    router.push('/login');
  };

  return (
    <AppBar
      position="fixed"
      color="inherit"
      elevation={1}
      sx={{ zIndex: 1201 }}
    >
      <Toolbar
        sx={{
          minHeight: { xs: 44, sm: 52 },
          padding: 0,
        }}
      >
        <Typography
          variant="h6"
          sx={{
            position: 'absolute',
            fontWeight: 700,
            color: theme.palette.primary.main,
            whiteSpace: 'nowrap',
            fontSize: { xs: 14, sm: 18 },
          }}
        >
          Như Quỳnh Chess
        </Typography>
        {user ? (
          <>
            <Tooltip title="Tài khoản" placement="bottom" arrow>
              <IconButton
                size="large"
                onClick={handleMenuOpen}
                color="inherit"
                sx={{ position: 'absolute', right: 0 }}
              >
                <AccountCircle />
              </IconButton>
            </Tooltip>
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleMenuClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              slotProps={{
                paper: {
                  sx: {
                    marginTop: 1,
                    minWidth: 200,
                  },
                },
              }}
              disableScrollLock={true}
              keepMounted={false}
            >
              <MenuItem onClick={() => router.push('/dashboard')}>
                <ListItemIcon>
                  <DashboardIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Bảng điều khiển</ListItemText>
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleLogout}>
                <ListItemIcon>
                  <LogoutIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Đăng xuất</ListItemText>
              </MenuItem>
            </Menu>
          </>
        ) : (
          <Tooltip title="Đăng nhập vào hệ thống" placement="bottom" arrow>
            <Button
              color="primary"
              onClick={handleLoginClick}
              sx={{
                position: 'absolute',
                right: 0,
              }}
            >
              Đăng nhập
            </Button>
          </Tooltip>
        )}
      </Toolbar>
    </AppBar>
  );
}
