'use client';
import React, { useState, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import gameDetails from '@/data/game_details.json';
import FilterSidebar from './FilterSidebar';
import CatalogueHeader from './CatalogueHeader';
import ActiveFilters from './ActiveFilters';
import Pagination from './Pagination';
import GameCard from '../../shared/GameCard';

export default function CatalogLayout({ isSalesMode, heading }) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const currentGenre = searchParams.get('genre') || '';
    const currentPlatform = searchParams.get('platform') || '';
    const currentLanguage = searchParams.get('language') || '';
    const currentSort = searchParams.get('sort') || 'default';
    const currentLimit = parseInt(searchParams.get('limit') || '9', 10);
    const currentPage = parseInt(searchParams.get('page') || '1', 10);
    const minPrice = parseFloat(searchParams.get('minPrice') || '0');
    const maxPrice = parseFloat(searchParams.get('maxPrice') || '500');

    const [gridCols, setGridCols] = useState(4);

    // 1. Fully Filtered Array (Total results before slicing for pages)
    const allFilteredGames = useMemo(() => {
        let result = [...gameDetails];
        if (isSalesMode || searchParams.get('stock_status') === 'onsale') {
            result = result.filter(game => game.oldPrice && game.price < game.oldPrice);
        }
        if (currentGenre) {
            result = result.filter(game => game.genre?.toLowerCase() === currentGenre.toLowerCase());
        }
        if (currentPlatform) {
            result = result.filter(game =>
                game.options?.platforms?.some(p => p.toLowerCase() === currentPlatform.toLowerCase())
            );
        }
        if (currentLanguage) {
            result = result.filter(game =>
                game.specifications?.languages?.some(l => l.toLowerCase().includes(currentLanguage.toLowerCase()))
            );
        }
        result = result.filter(game => game.price >= minPrice && game.price <= maxPrice);
        if (currentSort === 'low-to-high') {
            result.sort((a, b) => a.price - b.price);
        } else if (currentSort === 'high-to-low') {
            result.sort((a, b) => b.price - a.price);
        } else if (currentSort === 'average-rating') {
            result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        } else if (currentSort === 'latest') {
            result.sort((a, b) => new Date(b.specifications?.releaseDate || 0) - new Date(a.specifications?.releaseDate || 0));
        }
        return result;
    }, [isSalesMode, searchParams, currentGenre, currentPlatform, currentLanguage, currentSort, minPrice, maxPrice]);

    // 2. Slice data exactly for the current active page view
    const displayedGames = useMemo(() => {
        const startIndex = (currentPage - 1) * currentLimit;
        const endIndex = startIndex + currentLimit;
        return allFilteredGames.slice(startIndex, endIndex);
    }, [allFilteredGames, currentPage, currentLimit]);

    const updateFilters = (newParams) => {
        const params = new URLSearchParams(searchParams.toString());

        // Reset back to page 1 if user changes filters (like structural categories)
        if (!newParams.hasOwnProperty('page') && newParams.hasOwnProperty('genre') || newParams.hasOwnProperty('platform') || newParams.hasOwnProperty('language') || newParams.hasOwnProperty('minPrice')) {
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
                totalCount={allFilteredGames.length}
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
                        currentGenre={currentGenre}
                        currentPlatform={currentPlatform}
                        currentLanguage={currentLanguage}
                        minPrice={minPrice}
                        maxPrice={maxPrice}
                    />
                </aside>
                <div className="flex-grow w-full flex flex-col">
                    {displayedGames.length === 0 ? (
                        <div className="text-center py-20 text-gray-500 font-medium text-lg">
                            No products/games in catalogue match your filters.
                        </div>
                    ) : (
                        <>
                            <div className={`grid gap-x-6 gap-y-8 w-full ${gridCols === 3 ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4'}`}>
                                {displayedGames.map((game) => (
                                    <GameCard
                                        key={game.id}
                                        id={game.id}
                                        title={game.title}
                                        price={game.price}
                                        oldPrice={game.oldPrice}
                                        rating={game.rating}
                                        tags={game.tags}
                                        image={game.options?.editions?.[0]?.image || ''}
                                    />
                                ))}
                            </div>
                            <Pagination
                                totalCount={allFilteredGames.length}
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