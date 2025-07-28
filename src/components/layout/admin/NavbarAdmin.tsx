'use client';
import { AppBar, Toolbar, Typography, useTheme } from '@mui/material';

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
      </Toolbar>
    </AppBar>
  );
}
