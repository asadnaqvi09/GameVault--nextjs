'use client';

import { Suspense } from 'react';
import AdminOrdersContent from './AdminOrdersContent';

export default function AdminOrdersPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="w-10 h-10 rounded-full border-4 border-[#5B42F3]/20 border-t-[#5B42F3] animate-spin" />
        </div>
      }
    >
      <AdminOrdersContent />
    </Suspense>
  );
}
