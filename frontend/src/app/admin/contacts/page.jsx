'use client';

import { Suspense, useCallback, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { RefreshCw } from 'lucide-react';
import AdminShell from '@/components/admin/AdminShell';
import DataTable from '@/components/admin/ui/DataTable';
import Pagination from '@/components/admin/ui/Pagination';
import Modal from '@/components/admin/ui/Modal';
import { useToast } from '@/context/ToastContext';
import { fetchAdminContacts, updateContactStatus } from '@/lib/api/adminContactApi';

const statusOptions = [
  { value: '', label: 'All statuses' },
  { value: 'pending', label: 'Pending' },
  { value: 'read', label: 'Read' },
  { value: 'replied', label: 'Replied' },
];

const statusStyles = {
  pending: 'bg-amber-100 text-amber-700',
  read: 'bg-blue-100 text-blue-700',
  replied: 'bg-emerald-100 text-emerald-700',
};

function AdminContactsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showToast } = useToast();
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
  const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '20', 10)));
  const status = searchParams.get('status') || '';
  const search = searchParams.get('search') || '';
  const [contacts, setContacts] = useState([]);
  const [meta, setMeta] = useState({ page: 1, limit: 20, total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState(search);
  const [selected, setSelected] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const updateParams = useCallback((updates) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value === '' || value === null || value === undefined) params.delete(key);
      else params.set(key, String(value));
    });
    router.push(`/admin/contacts?${params.toString()}`);
  }, [router, searchParams]);

  const loadContacts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchAdminContacts({
        page,
        limit,
        status: status || undefined,
        search: search || undefined,
      });
      setContacts(res.data || []);
      setMeta(res.meta || { page, limit, total: 0, totalPages: 1 });
    } catch (err) {
      showToast(err.message || 'Failed to load contacts', 'error');
    } finally {
      setLoading(false);
    }
  }, [page, limit, status, search, showToast]);

  useEffect(() => {
    loadContacts();
  }, [loadContacts]);

  const setStatus = async (id, newStatus) => {
    setSubmitting(true);
    try {
      await updateContactStatus(id, newStatus);
      showToast('Status updated');
      setSelected((prev) => (prev?.id === id ? { ...prev, status: newStatus } : prev));
      loadContacts();
    } catch (err) {
      showToast(err.message || 'Failed to update status', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    {
      key: 'name',
      label: 'Name',
      render: (row) => `${row.firstName} ${row.lastName}`,
    },
    { key: 'email', label: 'Email' },
    {
      key: 'message',
      label: 'Message',
      render: (row) => <p className="line-clamp-2 max-w-sm text-gray-600">{row.message}</p>,
    },
    {
      key: 'status',
      label: 'Status',
      render: (row) => (
        <span className={`text-xs font-bold px-2.5 py-1 rounded-full capitalize ${statusStyles[row.status] || 'bg-gray-100 text-gray-600'}`}>
          {row.status}
        </span>
      ),
    },
    {
      key: 'createdAt',
      label: 'Date',
      render: (row) => new Date(row.createdAt).toLocaleDateString(),
    },
  ];

  return (
    <AdminShell title="Contacts">
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && updateParams({ search: searchInput.trim(), page: 1 })}
            placeholder="Search contacts..."
            className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm w-64 focus:outline-none focus:border-[#5B42F3]"
          />
          <select
            value={status}
            onChange={(e) => updateParams({ status: e.target.value, page: 1 })}
            className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm cursor-pointer focus:outline-none focus:border-[#5B42F3]"
          >
            {statusOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <button type="button" onClick={() => updateParams({ search: searchInput.trim(), page: 1 })} className="px-4 py-2.5 text-sm font-semibold bg-[#5B42F3] text-white rounded-xl cursor-pointer hover:bg-[#4a35d9]">
            Search
          </button>
          <button type="button" onClick={loadContacts} disabled={loading} className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-[#5B42F3] bg-[#5B42F3]/10 rounded-xl cursor-pointer hover:bg-[#5B42F3]/15 disabled:opacity-50 ml-auto">
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>
        {loading ? (
          <div className="rounded-2xl border border-gray-100 bg-white p-12 text-center">
            <div className="w-8 h-8 mx-auto rounded-full border-4 border-[#5B42F3]/20 border-t-[#5B42F3] animate-spin" />
          </div>
        ) : (
          <>
            <DataTable
              columns={columns}
              rows={contacts}
              onRowClick={setSelected}
              emptyMessage="No contact messages found."
            />
            <Pagination page={meta.page} totalPages={meta.totalPages} total={meta.total} onPageChange={(p) => updateParams({ page: p })} />
          </>
        )}
      </div>
      <Modal open={!!selected} onClose={() => setSelected(null)} title="Contact message" size="md">
        {selected && (
          <div className="space-y-4">
            <div className="text-sm space-y-1">
              <p className="font-bold text-gray-900">{selected.firstName} {selected.lastName}</p>
              <p className="text-gray-600">{selected.email}</p>
              <p className="text-xs text-gray-400">{new Date(selected.createdAt).toLocaleString()}</p>
            </div>
            <p className="text-sm text-gray-700 bg-gray-50 rounded-xl p-4 whitespace-pre-wrap">{selected.message}</p>
            <div className="flex flex-wrap gap-2">
              {selected.status !== 'read' && (
                <button type="button" disabled={submitting} onClick={() => setStatus(selected.id, 'read')} className="px-4 py-2 text-sm font-semibold bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700 disabled:opacity-50">
                  Mark as read
                </button>
              )}
              {selected.status !== 'replied' && (
                <button type="button" disabled={submitting} onClick={() => setStatus(selected.id, 'replied')} className="px-4 py-2 text-sm font-semibold bg-emerald-600 text-white rounded-lg cursor-pointer hover:bg-emerald-700 disabled:opacity-50">
                  Mark as replied
                </button>
              )}
            </div>
          </div>
        )}
      </Modal>
    </AdminShell>
  );
}

export default function AdminContactsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-gray-50"><div className="w-10 h-10 rounded-full border-4 border-[#5B42F3]/20 border-t-[#5B42F3] animate-spin" /></div>}>
      <AdminContactsContent />
    </Suspense>
  );
}
