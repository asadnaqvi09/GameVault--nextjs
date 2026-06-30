'use client';

import { Suspense, useCallback, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { RefreshCw, Trash2 } from 'lucide-react';
import AdminShell from '@/components/admin/AdminShell';
import DataTable from '@/components/admin/ui/DataTable';
import Pagination from '@/components/admin/ui/Pagination';
import Modal from '@/components/admin/ui/Modal';
import ConfirmDialog from '@/components/admin/ui/ConfirmDialog';
import { useToast } from '@/context/ToastContext';
import { fetchAdminReviews, moderateReview, hardDeleteReview } from '@/lib/api/adminReviewApi';

function AdminReviewsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showToast } = useToast();
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
  const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '20', 10)));
  const isApproved = searchParams.get('isApproved') || '';
  const search = searchParams.get('search') || '';
  const [reviews, setReviews] = useState([]);
  const [meta, setMeta] = useState({ page: 1, limit: 20, total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState(search);
  const [selected, setSelected] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const updateParams = useCallback((updates) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value === '' || value === null || value === undefined) params.delete(key);
      else params.set(key, String(value));
    });
    router.push(`/admin/reviews?${params.toString()}`);
  }, [router, searchParams]);

  const loadReviews = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchAdminReviews({
        page,
        limit,
        isApproved: isApproved || undefined,
        search: search || undefined,
      });
      setReviews(res.data || []);
      setMeta(res.meta || { page, limit, total: 0, totalPages: 1 });
    } catch (err) {
      showToast(err.message || 'Failed to load reviews', 'error');
    } finally {
      setLoading(false);
    }
  }, [page, limit, isApproved, search, showToast]);

  useEffect(() => {
    loadReviews();
  }, [loadReviews]);

  const handleModerate = async (reviewId, approved) => {
    setSubmitting(true);
    try {
      await moderateReview(reviewId, approved);
      showToast(approved ? 'Review approved' : 'Review unapproved');
      setSelected(null);
      loadReviews();
    } catch (err) {
      showToast(err.message || 'Failed to update review', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    setSubmitting(true);
    try {
      await hardDeleteReview(deleteId);
      showToast('Review deleted');
      setDeleteId(null);
      setSelected(null);
      loadReviews();
    } catch (err) {
      showToast(err.message || 'Failed to delete review', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    {
      key: 'game',
      label: 'Game',
      render: (row) => (
        <div>
          <p className="font-semibold text-gray-900">{row.game?.title || '—'}</p>
          <p className="text-xs text-gray-400">{row.game?.slug}</p>
        </div>
      ),
    },
    { key: 'username', label: 'User', render: (row) => row.username },
    {
      key: 'rating',
      label: 'Rating',
      render: (row) => `${row.userRating}/5`,
    },
    {
      key: 'comment',
      label: 'Comment',
      render: (row) => (
        <p className="line-clamp-2 max-w-xs text-gray-600">{row.comment}</p>
      ),
    },
    {
      key: 'isApproved',
      label: 'Status',
      render: (row) => (
        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${row.isApproved ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
          {row.isApproved ? 'Approved' : 'Pending'}
        </span>
      ),
    },
    { key: 'date', label: 'Date' },
  ];

  return (
    <AdminShell title="Reviews">
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && updateParams({ search: searchInput.trim(), page: 1 })}
            placeholder="Search reviews..."
            className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm w-64 focus:outline-none focus:border-[#5B42F3]"
          />
          <select
            value={isApproved}
            onChange={(e) => updateParams({ isApproved: e.target.value, page: 1 })}
            className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm cursor-pointer focus:outline-none focus:border-[#5B42F3]"
          >
            <option value="">All</option>
            <option value="false">Pending</option>
            <option value="true">Approved</option>
          </select>
          <button type="button" onClick={() => updateParams({ search: searchInput.trim(), page: 1 })} className="px-4 py-2.5 text-sm font-semibold bg-[#5B42F3] text-white rounded-xl cursor-pointer hover:bg-[#4a35d9]">
            Search
          </button>
          <button type="button" onClick={loadReviews} disabled={loading} className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-[#5B42F3] bg-[#5B42F3]/10 rounded-xl cursor-pointer hover:bg-[#5B42F3]/15 disabled:opacity-50 ml-auto">
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
              rows={reviews.map((r) => ({ ...r, id: r.reviewId }))}
              onRowClick={(row) => setSelected(row)}
              emptyMessage="No reviews found."
            />
            <Pagination page={meta.page} totalPages={meta.totalPages} total={meta.total} onPageChange={(p) => updateParams({ page: p })} />
          </>
        )}
      </div>
      <Modal open={!!selected} onClose={() => setSelected(null)} title="Review details" size="md">
        {selected && (
          <div className="space-y-4">
            <div className="text-sm space-y-1">
              <p><span className="text-gray-500">Game:</span> <span className="font-semibold">{selected.game?.title}</span></p>
              <p><span className="text-gray-500">User:</span> {selected.username}</p>
              <p><span className="text-gray-500">Rating:</span> {selected.userRating}/5</p>
              <p><span className="text-gray-500">Date:</span> {selected.date}</p>
            </div>
            <p className="text-sm text-gray-700 bg-gray-50 rounded-xl p-4 whitespace-pre-wrap">{selected.comment}</p>
            <div className="flex flex-wrap gap-2 pt-2">
              {!selected.isApproved && (
                <button type="button" disabled={submitting} onClick={() => handleModerate(selected.reviewId, true)} className="px-4 py-2 text-sm font-semibold bg-emerald-600 text-white rounded-lg cursor-pointer hover:bg-emerald-700 disabled:opacity-50">
                  Approve
                </button>
              )}
              {selected.isApproved && (
                <button type="button" disabled={submitting} onClick={() => handleModerate(selected.reviewId, false)} className="px-4 py-2 text-sm font-semibold bg-amber-600 text-white rounded-lg cursor-pointer hover:bg-amber-700 disabled:opacity-50">
                  Unapprove
                </button>
              )}
              <button type="button" onClick={() => setDeleteId(selected.reviewId)} className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-red-600 border border-red-200 rounded-lg cursor-pointer hover:bg-red-50">
                <Trash2 size={16} />
                Delete
              </button>
            </div>
          </div>
        )}
      </Modal>
      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={confirmDelete}
        title="Delete review"
        message="Permanently delete this review? This cannot be undone."
        confirmLabel="Delete"
        loading={submitting}
      />
    </AdminShell>
  );
}

export default function AdminReviewsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-gray-50"><div className="w-10 h-10 rounded-full border-4 border-[#5B42F3]/20 border-t-[#5B42F3] animate-spin" /></div>}>
      <AdminReviewsContent />
    </Suspense>
  );
}
