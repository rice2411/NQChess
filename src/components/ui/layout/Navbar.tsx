'use client';

import {
  AppBar,
  Toolbar,
  Box,
  IconButton,
  Stack,
  Container,
  Typography,
  Button,
  Menu,
  MenuItem,
  ListItemIcon,
  MenuList,
  ListItemText,
  Divider,
  Tooltip,
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import OndemandVideoIcon from '@mui/icons-material/OndemandVideo';
import StorefrontIcon from '@mui/icons-material/Storefront';
import GroupsIcon from '@mui/icons-material/Groups';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import LogoutIcon from '@mui/icons-material/Logout';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PersonIcon from '@mui/icons-material/Person';
import { useState, useEffect } from 'react';
import { useTheme, alpha } from '@mui/material/styles';
import { useAuthStore } from '@/store/useAuthStore';
import { signOutUser } from '@/lib/firebase-auth';
import { useRouter } from 'next/navigation';
import { AccountCircle } from '@mui/icons-material';

const NAV_ICONS = [
  { label: 'Home', icon: <HomeIcon fontSize="inherit" />, key: 'home' },
  {
    label: 'Bạn bè',
    icon: <PeopleAltIcon fontSize="inherit" />,
    key: 'friends',
  },
  {
    label: 'Video',
    icon: <OndemandVideoIcon fontSize="inherit" />,
    key: 'video',
  },
  { label: 'Chợ', icon: <StorefrontIcon fontSize="inherit" />, key: 'market' },
  { label: 'Nhóm', icon: <GroupsIcon fontSize="inherit" />, key: 'groups' },
];

export default function Navbar() {
  const [selected, setSelected] = useState('home');
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
        <Container
          maxWidth="sm"
          disableGutters
          // sx={{ py: 4, pt: { xs: 10, sm: 12 }, px: 0 }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
            <Box sx={{ flexGrow: 1 }}>
              <Stack
                direction="row"
                spacing={0}
                alignItems="center"
                sx={{
                  height: { xs: 44, sm: 52 },
                  width: '100%',
                  justifyContent: 'space-between',
                  px: 0,
                  position: 'relative',
                  zIndex: 2,
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: 0,
                    left: `${(NAV_ICONS.findIndex(item => item.key === selected) * 100) / NAV_ICONS.length}%`,
                    width: `${100 / NAV_ICONS.length}%`,
                    height: '3px',
                    backgroundColor: theme.palette.primary.main,
                    transition: 'left 0.3s ease-in-out',
                    zIndex: 1,
                  },
                }}
              >
                {NAV_ICONS.map((item, idx) => {
                  const isActive = selected === item.key;
                  return (
                    <Tooltip
                      key={item.key}
                      title={item.label}
                      placement="bottom"
                      arrow
                      enterDelay={500}
                      leaveDelay={0}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          width: `${90 / NAV_ICONS.length}% `,
                          justifyContent: 'center',
                          cursor: 'pointer',
                          position: 'relative',
                          backgroundColor: 'transparent',
                          transition: 'background 0.2s',
                          '&:hover': {
                            backgroundColor: alpha(
                              theme.palette.primary.main,
                              0.06
                            ),
                          },
                          borderRadius: 0,
                          p: 1,
                          height: '100%',
                        }}
                        onClick={() => setSelected(item.key)}
                      >
                        <IconButton
                          color={isActive ? 'primary' : 'default'}
                          sx={{
                            fontSize: { xs: 22, sm: 28 },
                            borderRadius: 0,
                            color: isActive
                              ? theme.palette.primary.main
                              : undefined,
                            background: 'transparent',
                            '&:hover': {
                              backgroundColor: 'transparent',
                            },
                          }}
                        >
                          {item.icon}
                        </IconButton>
                      </Box>
                    </Tooltip>
                  );
                })}
              </Stack>
            </Box>
          </Box>
        </Container>
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
            >
              <MenuItem onClick={() => router.push('/profile')}>
                <ListItemIcon>
                  <PersonIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Hồ sơ</ListItemText>
              </MenuItem>
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
