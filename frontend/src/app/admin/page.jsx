'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import AdminShell from '@/components/admin/AdminShell';
import DataTable from '@/components/admin/ui/DataTable';
import StatusBadge from '@/components/admin/ui/StatusBadge';
import { fetchDashboardStats } from '@/lib/api/adminStatsApi';
import { useToast } from '@/context/ToastContext';
import {
  ShoppingBag,
  CreditCard,
  Package,
  Gamepad2,
  Mail,
  MessageSquare,
} from 'lucide-react';

const kpiConfig = [
  { key: 'pendingReview', label: 'Payments to review', href: '/admin/orders?status=payment_under_review', icon: CreditCard, color: 'bg-blue-100 text-blue-700' },
  { key: 'pendingCod', label: 'COD pending', href: '/admin/orders?status=pending_payment', icon: ShoppingBag, color: 'bg-amber-100 text-amber-700' },
  { key: 'awaitingFulfillment', label: 'Awaiting fulfillment', href: '/admin/orders?status=paid', icon: Package, color: 'bg-emerald-100 text-emerald-700' },
  { key: 'unapprovedReviews', label: 'Unapproved reviews', href: '/admin/reviews?isApproved=false', icon: MessageSquare, color: 'bg-purple-100 text-purple-700' },
  { key: 'pendingContacts', label: 'Pending contacts', href: '/admin/contacts?status=pending', icon: Mail, color: 'bg-rose-100 text-rose-700' },
  { key: 'totalGames', label: 'Total games', href: '/admin/games', icon: Gamepad2, color: 'bg-indigo-100 text-indigo-700' },
];

export default function AdminDashboardPage() {
  const { showToast } = useToast();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats()
      .then((res) => setStats(res.data))
      .catch((err) => showToast(err.message || 'Failed to load stats', 'error'))
      .finally(() => setLoading(false));
  }, [showToast]);

  const columns = [
    {
      key: 'orderNumber',
      label: 'Order',
      render: (row) => (
        <div>
          <p className="font-bold text-gray-900">{row.orderNumber}</p>
          <p className="text-xs text-gray-400">{new Date(row.createdAt).toLocaleDateString()}</p>
        </div>
      ),
    },
    {
      key: 'customer',
      label: 'Customer',
      render: (row) => row.user?.userName || '—',
    },
    {
      key: 'total',
      label: 'Total',
      render: (row) => `PKR ${row.total?.toLocaleString()}`,
    },
    {
      key: 'status',
      label: 'Status',
      render: (row) => <StatusBadge status={row.status} />,
    },
  ];

  return (
    <AdminShell title="Dashboard">
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 rounded-full border-4 border-[#5B42F3]/20 border-t-[#5B42F3] animate-spin" />
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {kpiConfig.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.key}
                  href={item.href}
                  className="flex items-center gap-4 p-5 bg-white rounded-2xl border border-gray-100 hover:border-[#5B42F3]/30 hover:shadow-md transition-all cursor-pointer"
                >
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${item.color}`}>
                    <Icon size={20} />
                  </div>
                  <div>
                    <p className="text-2xl font-black text-gray-900">{stats?.[item.key] ?? 0}</p>
                    <p className="text-sm text-gray-500">{item.label}</p>
                  </div>
                </Link>
              );
            })}
          </div>
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Recent orders</h2>
              <Link href="/admin/orders" className="text-sm font-semibold text-[#5B42F3] hover:underline cursor-pointer">
                View all
              </Link>
            </div>
            <DataTable
              columns={columns}
              rows={(stats?.recentOrders || []).map((o) => ({ ...o, id: o.id }))}
              emptyMessage="No orders yet."
            />
          </div>
        </div>
      )}
    </AdminShell>
  );
}
