'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { RefreshCw } from 'lucide-react';
import AdminShell from '@/components/admin/AdminShell';
import DataTable from '@/components/admin/ui/DataTable';
import Pagination from '@/components/admin/ui/Pagination';
import StatusBadge from '@/components/admin/ui/StatusBadge';
import OrderDetailModal from '@/components/admin/orders/OrderDetailModal';
import { useToast } from '@/context/ToastContext';
import { ORDER_STATUS_OPTIONS, methodLabels } from '@/lib/admin/orderConstants';
import { fetchAdminOrders, fetchAdminOrderById } from '@/lib/api/adminOrderApi';

export default function AdminOrdersContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showToast } = useToast();

  const status = searchParams.get('status') || '';
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
  const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '20', 10)));

  const [orders, setOrders] = useState([]);
  const [meta, setMeta] = useState({ page: 1, limit: 20, total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const updateParams = useCallback(
    (updates) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, value]) => {
        if (value === '' || value === null || value === undefined) {
          params.delete(key);
        } else {
          params.set(key, String(value));
        }
      });
      router.push(`/admin/orders?${params.toString()}`);
    },
    [router, searchParams]
  );

  const loadOrders = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchAdminOrders({
        status: status || undefined,
        page,
        limit,
      });
      setOrders(res.data || []);
      setMeta(res.meta || { page, limit, total: 0, totalPages: 1 });
    } catch (err) {
      showToast(err.message || 'Failed to load orders', 'error');
    } finally {
      setLoading(false);
    }
  }, [status, page, limit, showToast]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const openOrder = async (row) => {
    setSelectedId(row.id);
    setSelectedOrder(row);
    setDetailLoading(true);
    try {
      const res = await fetchAdminOrderById(row.id);
      setSelectedOrder(res.data);
    } catch (err) {
      showToast(err.message || 'Failed to load order', 'error');
    } finally {
      setDetailLoading(false);
    }
  };

  const closeModal = () => {
    setSelectedId(null);
    setSelectedOrder(null);
  };

  const columns = [
    {
      key: 'orderNumber',
      label: 'Order',
      render: (row) => (
        <div>
          <p className="font-bold text-gray-900">{row.orderNumber}</p>
          <p className="text-xs text-gray-400 mt-0.5">{new Date(row.createdAt).toLocaleDateString()}</p>
        </div>
      ),
    },
    {
      key: 'customer',
      label: 'Customer',
      render: (row) => (
        <div>
          <p className="font-medium text-gray-800">{row.user?.userName || '—'}</p>
          <p className="text-xs text-gray-400">{row.user?.email || row.billingDetails?.email}</p>
        </div>
      ),
    },
    {
      key: 'paymentMethod',
      label: 'Method',
      render: (row) => methodLabels[row.paymentMethod] || row.paymentMethod,
    },
    {
      key: 'total',
      label: 'Total',
      render: (row) => (
        <span className="font-bold text-gray-900">PKR {row.total?.toLocaleString()}</span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (row) => <StatusBadge status={row.status} />,
    },
  ];

  return (
    <AdminShell title="Orders">
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <select
              value={status}
              onChange={(e) => updateParams({ status: e.target.value, page: 1 })}
              className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-700 bg-white focus:outline-none focus:border-[#5B42F3] cursor-pointer"
            >
              {ORDER_STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <select
              value={limit}
              onChange={(e) => updateParams({ limit: e.target.value, page: 1 })}
              className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-700 bg-white focus:outline-none focus:border-[#5B42F3] cursor-pointer"
            >
              {[10, 20, 30, 50].map((n) => (
                <option key={n} value={n}>
                  {n} per page
                </option>
              ))}
            </select>
          </div>
          <button
            type="button"
            onClick={loadOrders}
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-[#5B42F3] bg-[#5B42F3]/10 hover:bg-[#5B42F3]/15 rounded-xl transition-colors cursor-pointer disabled:opacity-50"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>

        {loading ? (
          <div className="rounded-2xl border border-gray-100 bg-white p-12 text-center">
            <div className="w-8 h-8 mx-auto rounded-full border-4 border-[#5B42F3]/20 border-t-[#5B42F3] animate-spin" />
            <p className="text-sm text-gray-400 mt-3">Loading orders...</p>
          </div>
        ) : (
          <>
            <DataTable
              columns={columns}
              rows={orders}
              onRowClick={openOrder}
              emptyMessage="No orders match your filters."
            />
            <Pagination
              page={meta.page}
              totalPages={meta.totalPages}
              total={meta.total}
              onPageChange={(p) => updateParams({ page: p })}
            />
          </>
        )}
      </div>

      <OrderDetailModal
        open={!!selectedId}
        order={selectedOrder}
        loading={detailLoading}
        onClose={closeModal}
        onRefresh={loadOrders}
        showToast={showToast}
      />
    </AdminShell>
  );
}
