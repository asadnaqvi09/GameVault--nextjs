'use client';
import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { buildGamesQuery, getGames, getOnSaleGames } from '@/store/api/gameApi';
import FilterSidebar from './FilterSidebar';
import CatalogueHeader from './CatalogueHeader';
import ActiveFilters from './ActiveFilters';
import Pagination from './Pagination';
import GameCard from '../../shared/GameCard';

export default function CatalogLayout({ isSalesMode, heading }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [gridCols, setGridCols] = useState(4);
  const [gameList, setGameList] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentLimit, setCurrentLimit] = useState(9);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  const currentSort = searchParams.get('sort') || 'default';

  useEffect(() => {
    let isMounted = true;
    const fetchCatalogueGames = async () => {
      setIsLoading(true);
      setFetchError(null);
      try {
        const query = buildGamesQuery(searchParams);
        const response = isSalesMode
          ? await getOnSaleGames(query)
          : await getGames(query);
        if (!isMounted) return;
        setGameList(response.data || []);
        setTotalCount(response.meta?.total ?? 0);
        setCurrentPage(response.meta?.page ?? query.page);
        setCurrentLimit(response.meta?.limit ?? query.limit);
      } catch {
        if (isMounted) {
          setGameList([]);
          setTotalCount(0);
          setFetchError('Failed to load games. Please try again.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };
    fetchCatalogueGames();
    return () => {
      isMounted = false;
    };
  }, [searchParams, isSalesMode]);

  const updateFilters = (newParams) => {
    const params = new URLSearchParams(searchParams.toString());
    if (!Object.prototype.hasOwnProperty.call(newParams, 'page') && (
      Object.prototype.hasOwnProperty.call(newParams, 'genre') ||
      Object.prototype.hasOwnProperty.call(newParams, 'platform') ||
      Object.prototype.hasOwnProperty.call(newParams, 'language') ||
      Object.prototype.hasOwnProperty.call(newParams, 'minPrice')
    )) {
      params.set('page', '1');
    }
    Object.entries(newParams).forEach(([key, value]) => {
      if (value === null || value === '') {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });
    router.push(`?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="max-w-[1400px] mx-auto w-full px-4 py-8 flex flex-col gap-6 bg-white">
      <CatalogueHeader
        heading={heading}
        totalCount={totalCount}
        gridCols={gridCols}
        setGridCols={setGridCols}
        currentSort={currentSort}
        currentLimit={currentLimit}
        updateFilters={updateFilters}
      />
      <ActiveFilters
        isSalesMode={isSalesMode || searchParams.get('stock_status') === 'onsale'}
        updateFilters={updateFilters}
      />
      <div className="flex gap-8 items-start relative w-full mt-2">
        <aside className="w-[300px] shrink-0 hidden lg:block sticky top-24">
          <FilterSidebar
            updateFilters={updateFilters}
            currentGenre={searchParams.get('genre') || ''}
            currentPlatform={searchParams.get('platform') || ''}
            currentLanguage={searchParams.get('language') || ''}
            minPrice={parseFloat(searchParams.get('minPrice') || '0')}
            maxPrice={parseFloat(searchParams.get('maxPrice') || '500')}
          />
        </aside>
        <div className="flex-grow w-full flex flex-col">
          {isLoading ? (
            <div className="text-center py-20 text-gray-500 font-medium text-lg">
              Loading games...
            </div>
          ) : fetchError ? (
            <div className="text-center py-20 text-red-500 font-medium text-lg">
              {fetchError}
            </div>
          ) : gameList.length === 0 ? (
            <div className="text-center py-20 text-gray-500 font-medium text-lg">
              No games in catalogue match your filters.
            </div>
          ) : (
            <>
              <div className={`grid gap-x-6 gap-y-8 w-full ${gridCols === 3 ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4'}`}>
                {gameList.map((game) => (
                  <GameCard
                    key={game.id}
                    id={game.id}
                    title={game.title}
                    price={game.price}
                    oldPrice={game.oldPrice}
                    rating={game.rating}
                    tags={game.tags}
                    image={game.image}
                  />
                ))}
              </div>
              <Pagination
                totalCount={totalCount}
                currentLimit={currentLimit}
                currentPage={currentPage}
                updateFilters={updateFilters}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
