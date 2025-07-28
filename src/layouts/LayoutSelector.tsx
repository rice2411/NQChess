'use client';
import { usePathname } from 'next/navigation';
import { ROUTES } from '@/constants/routes';
import AuthLayout from './AuthLayout';
import DefaultLayout from './DefaultLayout';
import AdminLayout from './AdminLayout';

export default function LayoutSelector({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Routes cho anonymous (public)
  const anonymousRoutes = [ROUTES.LOGIN];

  // Routes cho admin (protected)
  const adminRoutes = [
    ROUTES.DASHBOARD,
    ROUTES.STUDENTS,
    ROUTES.CLASSES,
    ROUTES.ATTENDANCE,
    ROUTES.TUITION,
    ROUTES.POSTS,
    ROUTES.USERS,
  ];

  const isAnonymous = anonymousRoutes.some(route => pathname?.includes(route));
  const isAdmin = adminRoutes.some(route => pathname?.includes(route));

  if (isAdmin) {
    return <AdminLayout>{children}</AdminLayout>;
  }

  if (isAnonymous) {
    return <AuthLayout>{children}</AuthLayout>;
  }

  return <DefaultLayout>{children}</DefaultLayout>;
}
