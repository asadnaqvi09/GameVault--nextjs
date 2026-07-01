'use client';
import { useEffect, useState } from 'react';
import { getAllGenres } from '@/store/api/gameApi';

export const NAVBAR_PLATFORMS = ['PC', 'PS5', 'Xbox Series X/S'];

let cachedGenres = null;
let inflight = null;

export function useNavbarCatalog() {
  const [genres, setGenres] = useState(cachedGenres || []);
  const [genresLoading, setGenresLoading] = useState(!cachedGenres);

  useEffect(() => {
    if (cachedGenres) {
      setGenres(cachedGenres);
      setGenresLoading(false);
      return;
    }
    if (!inflight) {
      inflight = getAllGenres()
        .then((res) => (res.data || []).map((g) => g.name))
        .catch(() => [])
        .finally(() => {
          inflight = null;
        });
    }
    inflight.then((names) => {
      cachedGenres = names;
      setGenres(names);
      setGenresLoading(false);
    });
  }, []);

  return { platforms: NAVBAR_PLATFORMS, genres, genresLoading };
}
