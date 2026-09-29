'use client';

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@storefront/auth';

export interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ children, fallback }) => {
  const { authState, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !authState.isAuthenticated) {
      const redirectUrl = `/login?redirect=${encodeURIComponent(pathname || '/my-account')}`;
      router.replace(redirectUrl);
    }
  }, [authState.isAuthenticated, isLoading, pathname, router]);

  if (isLoading) {
    return (
      fallback || (
        <div className="min-h-[50vh] flex flex-col items-center justify-center p-8 space-y-4">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 text-sm font-medium animate-pulse">
            Verifying customer session...
          </p>
        </div>
      )
    );
  }

  if (!authState.isAuthenticated) {
    return null;
  }

  return <>{children}</>;
};
