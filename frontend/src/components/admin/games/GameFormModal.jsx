'use client';

import { useEffect, useState } from 'react';
import Modal from '@/components/admin/ui/Modal';
import { ALLOWED_GENRES, emptyGameForm, formToPayload, gameToForm } from '@/lib/admin/gameForm';
import { createGame, updateGame } from '@/lib/api/adminGameApi';

const inputClass =
  'w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#5B42F3]';
const labelClass = 'text-xs font-bold text-gray-500 uppercase tracking-wide';

export default function GameFormModal({ open, onClose, initialGame, onSuccess, showToast }) {
  const isEdit = Boolean(initialGame);
  const [form, setForm] = useState(emptyGameForm());
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      setForm(initialGame ? gameToForm(initialGame) : emptyGameForm());
    }
  }, [open, initialGame]);

  const setField = (name, value) => setForm((prev) => ({ ...prev, [name]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = formToPayload(form, isEdit);
      if (isEdit) {
        await updateGame(initialGame.id, payload);
        showToast('Game updated');
      } else {
        await createGame(payload);
        showToast('Game created');
      }
      onSuccess();
      onClose();
    } catch (err) {
      showToast(err.message || 'Failed to save game', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title={isEdit ? 'Edit game' : 'Create game'} size="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {!isEdit && (
            <div>
              <label className={labelClass}>Slug</label>
              <input
                required
                value={form.id}
                onChange={(e) => setField('id', e.target.value)}
                className={`mt-1 ${inputClass}`}
                placeholder="game-slug"
              />
            </div>
          )}
          <div className={isEdit ? 'sm:col-span-2' : ''}>
            <label className={labelClass}>Title</label>
            <input
              required
              value={form.title}
              onChange={(e) => setField('title', e.target.value)}
              className={`mt-1 ${inputClass}`}
            />
          </div>
          <div>
            <label className={labelClass}>Price (PKR)</label>
            <input
              required
              type="number"
              min="0"
              value={form.price}
              onChange={(e) => setField('price', e.target.value)}
              className={`mt-1 ${inputClass}`}
            />
          </div>
          <div>
            <label className={labelClass}>Old price</label>
            <input
              type="number"
              min="0"
              value={form.oldPrice}
              onChange={(e) => setField('oldPrice', e.target.value)}
              className={`mt-1 ${inputClass}`}
            />
          </div>
          <div>
            <label className={labelClass}>Genre</label>
            <select
              value={form.genre}
              onChange={(e) => setField('genre', e.target.value)}
              className={`mt-1 ${inputClass} cursor-pointer`}
            >
              {ALLOWED_GENRES.map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Release date</label>
            <input
              required
              type="date"
              value={form.releaseDate}
              onChange={(e) => setField('releaseDate', e.target.value)}
              className={`mt-1 ${inputClass}`}
            />
          </div>
        </div>
        <div>
          <label className={labelClass}>Short description</label>
          <textarea
            required
            rows={3}
            value={form.smallDescription}
            onChange={(e) => setField('smallDescription', e.target.value)}
            className={`mt-1 ${inputClass} resize-none`}
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Publisher</label>
            <input required value={form.publisher} onChange={(e) => setField('publisher', e.target.value)} className={`mt-1 ${inputClass}`} />
          </div>
          <div>
            <label className={labelClass}>Developer</label>
            <input required value={form.developer} onChange={(e) => setField('developer', e.target.value)} className={`mt-1 ${inputClass}`} />
          </div>
          <div>
            <label className={labelClass}>Game mode</label>
            <input required value={form.gameMode} onChange={(e) => setField('gameMode', e.target.value)} className={`mt-1 ${inputClass}`} />
          </div>
          <div>
            <label className={labelClass}>Cover image URL</label>
            <input value={form.coverImage} onChange={(e) => setField('coverImage', e.target.value)} className={`mt-1 ${inputClass}`} />
          </div>
          <div>
            <label className={labelClass}>Platforms (comma)</label>
            <input value={form.platforms} onChange={(e) => setField('platforms', e.target.value)} className={`mt-1 ${inputClass}`} />
          </div>
          <div>
            <label className={labelClass}>Editions (comma)</label>
            <input value={form.editions} onChange={(e) => setField('editions', e.target.value)} className={`mt-1 ${inputClass}`} />
          </div>
          <div>
            <label className={labelClass}>Languages (comma)</label>
            <input value={form.languages} onChange={(e) => setField('languages', e.target.value)} className={`mt-1 ${inputClass}`} />
          </div>
          <div>
            <label className={labelClass}>Audio (comma)</label>
            <input value={form.audio} onChange={(e) => setField('audio', e.target.value)} className={`mt-1 ${inputClass}`} />
          </div>
          <div className="sm:col-span-2">
            <label className={labelClass}>Tags (comma)</label>
            <input value={form.tags} onChange={(e) => setField('tags', e.target.value)} className={`mt-1 ${inputClass}`} />
          </div>
          <div className="sm:col-span-2">
            <label className={labelClass}>Gallery image URLs (one per line)</label>
            <textarea rows={2} value={form.galleryImages} onChange={(e) => setField('galleryImages', e.target.value)} className={`mt-1 ${inputClass} resize-none`} />
          </div>
          <div className="sm:col-span-2">
            <label className={labelClass}>Video URL</label>
            <input value={form.mainVideoUrl} onChange={(e) => setField('mainVideoUrl', e.target.value)} className={`mt-1 ${inputClass}`} />
          </div>
        </div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={form.isActive}
            onChange={(e) => setField('isActive', e.target.checked)}
            className="cursor-pointer"
          />
          <span className="text-sm font-medium text-gray-700">Active in store</span>
        </label>
        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={onClose} className="px-4 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-lg cursor-pointer">
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-4 py-2.5 text-sm font-semibold bg-[#5B42F3] hover:bg-[#4a35d9] text-white rounded-lg cursor-pointer disabled:opacity-50"
          >
            {submitting ? 'Saving...' : isEdit ? 'Update game' : 'Create game'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
