'use client';

import { DashboardSidebar } from '@/components/dashboard-sidebar';
import { useAuth } from '@/contexts/auth-context';
import { useRouter, usePathname } from 'next/navigation';
import React, { useEffect } from 'react';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && user && !pathname.startsWith(`/${user.role}`)) {
      router.replace(`/${user.role}/dashboard`);
    }
  }, [user, loading, pathname, router]);

  if (loading || !user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  // Ensure user can only access their own role's pages
  if (!pathname.startsWith(`/${user.role}`)) {
     return (
      <div className="flex h-screen items-center justify-center">
        Redirecting to your dashboard...
      </div>
    );
  }

  return <DashboardSidebar>{children}</DashboardSidebar>;
}
