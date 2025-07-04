"use client";
import { usePathname } from 'next/navigation';
import { ROUTES_ANONYMOUS } from '@/constants/routes';
import DefaultLayout from '../app/layouts/DefaultLayout';
import NoLayout from '../app/layouts/NoLayout';

export default function LayoutSelector({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const noLayoutRoutes = Object.values(ROUTES_ANONYMOUS);
  const isNoLayout = noLayoutRoutes.includes(pathname);

  return isNoLayout
    ? <NoLayout>{children}</NoLayout>
    : <DefaultLayout>{children}</DefaultLayout>;
} 