import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import LayoutSelector from '../layouts/LayoutSelector';
import { ModalProvider } from '@/providers/ModalProvider';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Như Quỳnh Chess',
  description: 'Nền tảng quản lý lớp học cờ vua',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={inter.variable}>
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
        />
      </head>
      <body className={inter.className}>
        <ModalProvider>
          <LayoutSelector>{children}</LayoutSelector>
        </ModalProvider>
      </body>
    </html>
  );
}
