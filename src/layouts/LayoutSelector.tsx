'use client';
import { usePathname } from 'next/navigation';
import { ROUTES_ADMIN, ROUTES_ANONYMOUS } from '@/constants/routes';
import AuthLayout from './AuthLayout';
import DefaultLayout from './DefaultLayout';
import AdminLayout from './AdminLayout';

export default function LayoutSelector({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAnonymous = Object.values(ROUTES_ANONYMOUS).some(route =>
    pathname.includes(route)
  );
  const isAdmin = Object.values(ROUTES_ADMIN).some(route =>
    pathname.includes(route)
  );

  if (isAdmin) {
    return <AdminLayout>{children}</AdminLayout>;
  }

  if (isAnonymous) {
    return <AuthLayout>{children}</AuthLayout>;
  }

  return <DefaultLayout>{children}</DefaultLayout>;
}
