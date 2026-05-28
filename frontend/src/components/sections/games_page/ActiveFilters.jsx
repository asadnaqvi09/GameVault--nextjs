'use client';
import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { X } from 'lucide-react';
export default function ActiveFilters({ isSalesMode, updateFilters }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const currentGenre = searchParams.get('genre');
    const currentPlatform = searchParams.get('platform');
    const currentLanguage = searchParams.get('language');
    const hasPriceFilter = searchParams.has('minPrice') || searchParams.has('maxPrice');
    const handleSalesBadgeRemove = () => {
        const params = new URLSearchParams(searchParams.toString());
        params.delete('stock_status');
        router.push(`/games?${params.toString()}`);
    };
    const clearAllFilters = () => {
        if (isSalesMode) {
            router.push('/games');
        } else {
            router.push('?');
        }
    };
    const hasAnyFilter = isSalesMode || currentGenre || currentPlatform || currentLanguage || hasPriceFilter;
    if (!hasAnyFilter) return null;
    return (
        <div className="w-full flex flex-wrap gap-2 items-center select-none text-xs py-1">
            <button
                onClick={clearAllFilters}
                className="flex items-center gap-1 text-gray-500 hover:text-gray-900 font-bold uppercase transition-colors duration-150 mr-2"
            >
                <X size={14} strokeWidth={2.5} />
                Clear filters
            </button>
            {isSalesMode && (
                <button
                    onClick={handleSalesBadgeRemove}
                    className="flex items-center gap-1 px-2.5 py-1 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded font-semibold transition-colors duration-150 border border-transparent"
                >
                    <X size={12} strokeWidth={2.5} className="text-gray-400" />
                    On sale
                </button>
            )}
            {currentGenre && (
                <button
                    onClick={() => updateFilters({ genre: null })}
                    className="flex items-center gap-1 px-2.5 py-1 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded font-semibold transition-colors duration-150 border border-transparent"
                >
                    <X size={12} strokeWidth={2.5} className="text-gray-400" />
                    Genre: {currentGenre}
                </button>
            )}
            {currentPlatform && (
                <button
                    onClick={() => updateFilters({ platform: null })}
                    className="flex items-center gap-1 px-2.5 py-1 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded font-semibold transition-colors duration-150 border border-transparent"
                >
                    <X size={12} strokeWidth={2.5} className="text-gray-400" />
                    Platform: {currentPlatform}
                </button>
            )}
            {currentLanguage && (
                <button
                    onClick={() => updateFilters({ language: null })}
                    className="flex items-center gap-1 px-2.5 py-1 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded font-semibold transition-colors duration-150 border border-transparent"
                >
                    <X size={12} strokeWidth={2.5} className="text-gray-400" />
                    Lang: {currentLanguage}
                </button>
            )}
            {hasPriceFilter && (
                <button
                    onClick={() => updateFilters({ minPrice: null, maxPrice: null })}
                    className="flex items-center gap-1 px-2.5 py-1 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded font-semibold transition-colors duration-150 border border-transparent"
                >
                    <X size={12} strokeWidth={2.5} className="text-gray-400" />
                    Price Range
                </button>
            )}
        </div>
    );
}