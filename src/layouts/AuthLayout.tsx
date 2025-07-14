'use client';
import ThemeRegistry from '@/providers/ThemeRegistry';
import AuthInitProvider from '@/providers/AuthInitProvider';
import GlobalLoading from '@/providers/GlobalLoading';
import { ModalProvider } from '@/providers/ModalProvider';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AuthInitProvider>
        <ThemeRegistry>
          <ModalProvider>
            <GlobalLoading />
            {children}
          </ModalProvider>
        </ThemeRegistry>
      </AuthInitProvider>
    </>
  );
}
