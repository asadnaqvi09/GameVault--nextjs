'use client';

import { useCallback, useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, RefreshCw } from 'lucide-react';
import AdminShell from '@/components/admin/AdminShell';
import DataTable from '@/components/admin/ui/DataTable';
import Modal from '@/components/admin/ui/Modal';
import ConfirmDialog from '@/components/admin/ui/ConfirmDialog';
import { useToast } from '@/context/ToastContext';
import { ALLOWED_GENRES } from '@/lib/admin/gameForm';
import { fetchGenres, createGenre, updateGenre, deleteGenre } from '@/lib/api/adminGenreApi';

export default function AdminGenresPage() {
  const { showToast } = useToast();
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editGenre, setEditGenre] = useState(null);
  const [name, setName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const loadGenres = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchGenres();
      setGenres(res.data || []);
    } catch (err) {
      showToast(err.message || 'Failed to load genres', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    loadGenres();
  }, [loadGenres]);

  const existingNames = genres.map((g) => g.name);
  const availableToAdd = ALLOWED_GENRES.filter((g) => !existingNames.includes(g));

  const openCreate = () => {
    setEditGenre(null);
    setName(availableToAdd[0] || '');
    setFormOpen(true);
  };

  const openEdit = (genre) => {
    setEditGenre(genre);
    setName(genre.name);
    setFormOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editGenre) {
        await updateGenre(editGenre._id, { name });
        showToast('Genre updated');
      } else {
        await createGenre({ name });
        showToast('Genre created');
      }
      setFormOpen(false);
      loadGenres();
    } catch (err) {
      showToast(err.message || 'Failed to save genre', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    setSubmitting(true);
    try {
      await deleteGenre(deleteId);
      showToast('Genre deleted');
      setDeleteId(null);
      loadGenres();
    } catch (err) {
      showToast(err.message || 'Failed to delete genre', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    { key: 'name', label: 'Name', render: (row) => <span className="font-semibold text-gray-900">{row.name}</span> },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => openEdit(row)} className="p-2 text-gray-500 hover:text-[#5B42F3] hover:bg-[#5B42F3]/10 rounded-lg cursor-pointer">
            <Pencil size={16} />
          </button>
          <button type="button" onClick={() => setDeleteId(row._id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg cursor-pointer">
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <AdminShell title="Genres">
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <p className="text-sm text-gray-500">{genres.length} genre(s) in catalog</p>
          <div className="flex items-center gap-2">
            <button type="button" onClick={loadGenres} disabled={loading} className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-[#5B42F3] bg-[#5B42F3]/10 rounded-xl cursor-pointer hover:bg-[#5B42F3]/15 disabled:opacity-50">
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
              Refresh
            </button>
            <button
              type="button"
              onClick={openCreate}
              disabled={!availableToAdd.length}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold bg-[#5B42F3] text-white rounded-xl cursor-pointer hover:bg-[#4a35d9] disabled:opacity-50"
            >
              <Plus size={16} />
              Add genre
            </button>
          </div>
        </div>
        {loading ? (
          <div className="rounded-2xl border border-gray-100 bg-white p-12 text-center">
            <div className="w-8 h-8 mx-auto rounded-full border-4 border-[#5B42F3]/20 border-t-[#5B42F3] animate-spin" />
          </div>
        ) : (
          <DataTable columns={columns} rows={genres.map((g) => ({ ...g, id: g._id }))} emptyMessage="No genres yet." />
        )}
      </div>
      <Modal open={formOpen} onClose={() => setFormOpen(false)} title={editGenre ? 'Edit genre' : 'Add genre'} size="sm">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Genre name</label>
            <select
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm cursor-pointer focus:outline-none focus:border-[#5B42F3]"
            >
              {(editGenre ? ALLOWED_GENRES : availableToAdd).map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>
          <div className="flex justify-end gap-3">
            <button type="button" onClick={() => setFormOpen(false)} className="px-4 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-lg cursor-pointer">
              Cancel
            </button>
            <button type="submit" disabled={submitting} className="px-4 py-2.5 text-sm font-semibold bg-[#5B42F3] text-white rounded-lg cursor-pointer hover:bg-[#4a35d9] disabled:opacity-50">
              {submitting ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </Modal>
      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={confirmDelete}
        title="Delete genre"
        message="Delete this genre? It must not be used by any games."
        confirmLabel="Delete"
        loading={submitting}
      />
    </AdminShell>
  );
}
