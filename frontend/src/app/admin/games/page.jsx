'use client';

import { Suspense, useCallback, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { Plus, RefreshCw, Pencil, Trash2 } from 'lucide-react';
import AdminShell from '@/components/admin/AdminShell';
import DataTable from '@/components/admin/ui/DataTable';
import Pagination from '@/components/admin/ui/Pagination';
import ConfirmDialog from '@/components/admin/ui/ConfirmDialog';
import GameFormModal from '@/components/admin/games/GameFormModal';
import { useToast } from '@/context/ToastContext';
import { fetchAdminGames, fetchAdminGame, deleteGame, patchGame } from '@/lib/api/adminGameApi';

function AdminGamesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showToast } = useToast();
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
  const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '20', 10)));
  const search = searchParams.get('search') || '';
  const isActive = searchParams.get('isActive') || '';
  const [games, setGames] = useState([]);
  const [meta, setMeta] = useState({ page: 1, limit: 20, total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState(search);
  const [formOpen, setFormOpen] = useState(false);
  const [editGame, setEditGame] = useState(null);
  const [deleteSlug, setDeleteSlug] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const updateParams = useCallback((updates) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value === '' || value === null || value === undefined) params.delete(key);
      else params.set(key, String(value));
    });
    router.push(`/admin/games?${params.toString()}`);
  }, [router, searchParams]);

  const loadGames = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchAdminGames({
        page,
        limit,
        search: search || undefined,
        isActive: isActive || undefined,
      });
      setGames(res.data || []);
      setMeta(res.meta || { page, limit, total: 0, totalPages: 1 });
    } catch (err) {
      showToast(err.message || 'Failed to load games', 'error');
    } finally {
      setLoading(false);
    }
  }, [page, limit, search, isActive, showToast]);

  useEffect(() => {
    loadGames();
  }, [loadGames]);

  useEffect(() => {
    setSearchInput(search);
  }, [search]);

  const handleSearch = (e) => {
    e.preventDefault();
    updateParams({ search: searchInput.trim(), page: 1 });
  };

  const openEdit = async (row) => {
    try {
      const res = await fetchAdminGame(row.id);
      setEditGame(res.data);
      setFormOpen(true);
    } catch (err) {
      showToast(err.message || 'Failed to load game', 'error');
    }
  };

  const toggleActive = async (row) => {
    try {
      await patchGame(row.id, { isActive: !row.isActive });
      showToast(row.isActive ? 'Game deactivated' : 'Game activated');
      loadGames();
    } catch (err) {
      showToast(err.message || 'Failed to update game', 'error');
    }
  };

  const confirmDelete = async () => {
    if (!deleteSlug) return;
    setDeleting(true);
    try {
      await deleteGame(deleteSlug);
      showToast('Game deleted');
      setDeleteSlug(null);
      loadGames();
    } catch (err) {
      showToast(err.message || 'Failed to delete game', 'error');
    } finally {
      setDeleting(false);
    }
  };

  const columns = [
    {
      key: 'image',
      label: '',
      width: 56,
      render: (row) => (
        <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 relative">
          {row.image && (
            <Image src={row.image} alt="" fill className="object-cover" unoptimized />
          )}
        </div>
      ),
    },
    {
      key: 'title',
      label: 'Game',
      render: (row) => (
        <div>
          <p className="font-bold text-gray-900">{row.title}</p>
          <p className="text-xs text-gray-400">{row.id}</p>
        </div>
      ),
    },
    { key: 'genre', label: 'Genre' },
    {
      key: 'price',
      label: 'Price',
      render: (row) => `PKR ${row.price?.toLocaleString()}`,
    },
    {
      key: 'isActive',
      label: 'Status',
      render: (row) => (
        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${row.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
          {row.isActive ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
          <button type="button" onClick={() => openEdit(row)} className="p-2 text-gray-500 hover:text-[#5B42F3] hover:bg-[#5B42F3]/10 rounded-lg cursor-pointer">
            <Pencil size={16} />
          </button>
          <button type="button" onClick={() => toggleActive(row)} className="px-2 py-1 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-lg cursor-pointer">
            {row.isActive ? 'Deactivate' : 'Activate'}
          </button>
          <button type="button" onClick={() => setDeleteSlug(row.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg cursor-pointer">
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <AdminShell title="Games">
      <div className="space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <form onSubmit={handleSearch} className="flex flex-wrap items-center gap-3">
            <input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search games..."
              className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm w-64 focus:outline-none focus:border-[#5B42F3]"
            />
            <select
              value={isActive}
              onChange={(e) => updateParams({ isActive: e.target.value, page: 1 })}
              className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm cursor-pointer focus:outline-none focus:border-[#5B42F3]"
            >
              <option value="">All status</option>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
            <button type="submit" className="px-4 py-2.5 text-sm font-semibold bg-[#5B42F3] text-white rounded-xl cursor-pointer hover:bg-[#4a35d9]">
              Search
            </button>
          </form>
          <div className="flex items-center gap-2">
            <button type="button" onClick={loadGames} disabled={loading} className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-[#5B42F3] bg-[#5B42F3]/10 rounded-xl cursor-pointer hover:bg-[#5B42F3]/15 disabled:opacity-50">
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
              Refresh
            </button>
            <button
              type="button"
              onClick={() => { setEditGame(null); setFormOpen(true); }}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold bg-[#5B42F3] text-white rounded-xl cursor-pointer hover:bg-[#4a35d9]"
            >
              <Plus size={16} />
              Add game
            </button>
          </div>
        </div>
        {loading ? (
          <div className="rounded-2xl border border-gray-100 bg-white p-12 text-center">
            <div className="w-8 h-8 mx-auto rounded-full border-4 border-[#5B42F3]/20 border-t-[#5B42F3] animate-spin" />
          </div>
        ) : (
          <>
            <DataTable columns={columns} rows={games} emptyMessage="No games found." />
            <Pagination page={meta.page} totalPages={meta.totalPages} total={meta.total} onPageChange={(p) => updateParams({ page: p })} />
          </>
        )}
      </div>
      <GameFormModal
        open={formOpen}
        onClose={() => { setFormOpen(false); setEditGame(null); }}
        initialGame={editGame}
        onSuccess={loadGames}
        showToast={showToast}
      />
      <ConfirmDialog
        open={!!deleteSlug}
        onClose={() => setDeleteSlug(null)}
        onConfirm={confirmDelete}
        title="Delete game"
        message="This will soft-delete the game from the store. Continue?"
        confirmLabel="Delete"
        loading={deleting}
      />
    </AdminShell>
  );
}

export default function AdminGamesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-gray-50"><div className="w-10 h-10 rounded-full border-4 border-[#5B42F3]/20 border-t-[#5B42F3] animate-spin" /></div>}>
      <AdminGamesContent />
    </Suspense>
  );
}
