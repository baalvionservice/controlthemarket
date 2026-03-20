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
    if (loading) {
      return;
    }
    
    // If not loading and no user, the AuthProvider will handle the redirect to login.
    if (!user) {
        return;
    }

    // If the user is on the base '/dashboard' path, redirect them to their specific role's dashboard.
    if (pathname === '/dashboard') {
      router.replace(`/${user.role}/dashboard`);
      return;
    }
    
    // If the user is on a path that does not belong to their role, redirect them.
    if (!pathname.startsWith(`/${user.role}`)) {
      router.replace(`/${user.role}/dashboard`);
    }
  }, [user, loading, pathname, router]);

  // While loading or if no user is authenticated, show a loading spinner.
  // The AuthProvider will handle redirecting unauthenticated users to the login page.
  if (loading || !user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  // To prevent content flashing while redirecting, we can show a loading state
  // if the current path is not yet the correct one for the user's role.
  const isCorrectPath = pathname.startsWith(`/${user.role}`) || pathname === '/dashboard';
  if (!isCorrectPath) {
     return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return <DashboardSidebar>{children}</DashboardSidebar>;
}
