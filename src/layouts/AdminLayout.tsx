'use client';
import ThemeRegistry from '@/providers/ThemeRegistry';
import AuthInitProvider from '@/providers/AuthInitProvider';
import GlobalLoading from '@/providers/GlobalLoading';
import SidebarAdmin from '@/components/layout/admin/SidebarAdmin';
import NavbarAdmin from '@/components/layout/admin/NavbarAdmin';
import { Box } from '@mui/material';
import { ModalProvider } from '@/providers/ModalProvider';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthInitProvider>
      <ThemeRegistry>
        <ModalProvider>
          <GlobalLoading />
          <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'grey.50' }}>
            <SidebarAdmin />
            <Box
              sx={{
                flexGrow: 1,
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <NavbarAdmin />
              <Box component="main" sx={{ flexGrow: 1, py: 8 }}>
                {' '}
                {/* pt: 8 = 64px để tránh bị che bởi navbar */}
                {children}
              </Box>
            </Box>
          </Box>
        </ModalProvider>
      </ThemeRegistry>
    </AuthInitProvider>
  );
}
