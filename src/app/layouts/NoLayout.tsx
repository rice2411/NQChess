"use client";
import ThemeRegistry from '@/providers/ThemeRegistry';
import GlobalLoading from '@/providers/GlobalLoading';

export default function NoLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeRegistry>
      <GlobalLoading />
      {children}
    </ThemeRegistry>
  );
} 