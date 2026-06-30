'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

export function useAdminGuard() {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, isLoading, user } = useAuth();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (isLoading) return;

    setChecked(true);

    if (!isAuthenticated) {
      router.replace(`/auth?redirect=${encodeURIComponent(pathname)}`);
      return;
    }

    if (user?.role !== 'Admin') {
      router.replace('/');
    }
  }, [isLoading, isAuthenticated, user, router, pathname]);

  const isAdmin = isAuthenticated && user?.role === 'Admin';
  const isReady = checked && isAdmin && !isLoading;

  return { isReady, isLoading: isLoading || !checked, user, isAdmin };
}
