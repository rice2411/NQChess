'use client';
import ThemeRegistry from '@/providers/ThemeRegistry';
import AuthInitProvider from '@/providers/AuthInitProvider';
import GlobalLoading from '@/providers/GlobalLoading';
import SidebarAdmin from '@/components/layout/admin/SidebarAdmin';
import NavbarAdmin from '@/components/layout/admin/NavbarAdmin';
import { Box } from '@mui/material';
import { useTuitionAutoCreate } from '@/hooks/useTuitionAutoCreate';
import { useAttendanceAutoCreate } from '@/hooks/useAttendanceAutoCreate';
import { ModalProvider } from '@/providers/ModalProvider';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Tự động tạo học phí khi admin đăng nhập
  useTuitionAutoCreate();

  // Tự động tạo buổi điểm danh khi admin đăng nhập
  useAttendanceAutoCreate();

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
