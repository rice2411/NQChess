'use client';
import { Container } from '@mui/material';
import ThemeRegistry from '@/providers/ThemeRegistry';
import AuthInitProvider from '@/providers/AuthInitProvider';
import GlobalLoading from '@/providers/GlobalLoading';
import Navbar from '@/components/layout/Navbar';
import { ModalProvider } from '@/providers/ModalProvider';

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthInitProvider>
      <ThemeRegistry>
        <ModalProvider>
          <GlobalLoading />
          <Navbar />
          <Container maxWidth="sm" disableGutters>
            {children}
          </Container>
        </ModalProvider>
      </ThemeRegistry>
    </AuthInitProvider>
  );
}
