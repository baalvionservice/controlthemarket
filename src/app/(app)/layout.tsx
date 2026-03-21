'use client';

import { DashboardSidebar } from '@/components/dashboard-sidebar';
import { useAuth } from '@/contexts/auth-context';
import { useRouter, usePathname } from 'next/navigation';
import React, { useEffect } from 'react';
import { useConsent } from '@/contexts/consent-context';
import { ConsentModal } from '@/components/consent-modal';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  const { isConsentGiven, loading: consentLoading } = useConsent();
  const router = useRouter();
  const pathname = usePathname();

  const loading = authLoading || consentLoading;

  useEffect(() => {
    if (loading) {
      return;
    }
    
    if (!user) {
        return; // AuthProvider will handle the redirect to login.
    }

    // Onboarding check for company users
    if (user.role === 'company' && !user.onboardingCompleted && !pathname.startsWith('/company/onboarding')) {
      router.replace('/company/onboarding');
      return; // Redirect and stop further checks
    }

    // If the user is on the base '/dashboard' path, redirect them to their specific role's dashboard.
    if (pathname === '/dashboard') {
      router.replace(`/${user.role}/dashboard`);
      return;
    }
    
    // If the user is on a path that does not belong to their role (and not in onboarding), redirect them.
    if (!pathname.startsWith(`/${user.role}`)) {
      router.replace(`/${user.role}/dashboard`);
    }
  }, [user, loading, pathname, router]);

  if (user?.role === 'candidate' && !isConsentGiven && !loading) {
    return <ConsentModal />;
  }

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
  
  // Don't show sidebar during onboarding
  if (pathname.startsWith('/company/onboarding')) {
    return <main>{children}</main>;
  }

  return <DashboardSidebar>{children}</DashboardSidebar>;
}
