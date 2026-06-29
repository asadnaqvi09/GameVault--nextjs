import { apiRequest, buildQueryString } from '@/lib/api/request';

export function buildGamesQuery(searchParams) {
  const query = {};
  const keys = ['page', 'limit', 'genre', 'platform', 'language', 'minPrice', 'maxPrice', 'sort', 'stock_status', 'tags', 'search'];
  keys.forEach((key) => {
    const value = searchParams.get(key);
    if (value === null || value === '') return;
    if (key === 'page' || key === 'limit' || key === 'minPrice' || key === 'maxPrice') {
      query[key] = Number(value);
      return;
    }
    query[key] = value;
  });
  if (!query.page) query.page = 1;
  if (!query.limit) query.limit = 9;
  if (!query.sort) query.sort = 'default';
  if (query.minPrice === undefined) query.minPrice = 0;
  if (query.maxPrice === undefined) query.maxPrice = 500;
  return query;
}

export async function getGames(params = {}) {
  return apiRequest(`/games${buildQueryString(params)}`);
}

export async function getOnSaleGames(params = {}) {
  return apiRequest(`/games/on-sale${buildQueryString(params)}`);
}

export async function getOnSaleCount() {
  const res = await apiRequest('/games/on-sale/count');
  return res.data?.count ?? 0;
}

export async function getTopSellers(limit = 5) {
  return apiRequest(`/games/top-sellers${buildQueryString({ limit })}`);
}

export async function getGameBySlug(slug) {
  return apiRequest(`/games/${slug}`);
}

export async function getRelatedGames(slug) {
  return apiRequest(`/games/related/${slug}`);
}

export async function getAllGenres() {
  return apiRequest('/genre/get-all-genre');
}
