'use client';
import { Container } from '@mui/material';
import ThemeRegistry from '@/providers/ThemeRegistry';
import AuthInitProvider from '@/providers/AuthInitProvider';
import GlobalLoading from '@/providers/GlobalLoading';
import Navbar from '@/components/ui/layout/Navbar';

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthInitProvider>
      <ThemeRegistry>
        <GlobalLoading />
        <Navbar />
        <Container maxWidth="sm" disableGutters>
          {children}
        </Container>
      </ThemeRegistry>
    </AuthInitProvider>
  );
}
