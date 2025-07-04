"use client";
import ThemeRegistry from "@/providers/ThemeRegistry";
import AuthInitProvider from "@/providers/AuthInitProvider";
import GlobalLoading from "@/providers/GlobalLoading";
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AuthInitProvider>
        <ThemeRegistry>
          <GlobalLoading />
          {children}
        </ThemeRegistry>
      </AuthInitProvider>
    </>
  );
}
