'use client';

import { useState } from 'react';
import { useAdminGuard } from '@/hooks/useAdminGuard';
import AdminSidebar from './AdminSidebar';
import AdminTopbar from './AdminTopbar';

export default function AdminShell({ title, children }) {
  const { isReady, isLoading } = useAdminGuard();
  const [mobileOpen, setMobileOpen] = useState(false);

  if (isLoading || !isReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full border-4 border-[#5B42F3]/20 border-t-[#5B42F3] animate-spin" />
          <p className="text-sm font-medium text-gray-500">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gray-50">
      <AdminSidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        <AdminTopbar title={title} onMenuOpen={() => setMobileOpen(true)} />
        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
