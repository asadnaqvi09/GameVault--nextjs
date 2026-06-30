'use client';

import { statusLabels, statusStyles } from '@/lib/admin/orderConstants';

export default function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex items-center text-xs font-bold px-2.5 py-1 rounded-full whitespace-nowrap ${
        statusStyles[status] || 'bg-gray-100 text-gray-600'
      }`}
    >
      {statusLabels[status] || status}
    </span>
  );
}
