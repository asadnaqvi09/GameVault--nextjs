'use client';
import React from 'react';
import { Grid3X3, Grid2X2 } from 'lucide-react';
export default function CatalogHeader({ heading, totalCount, gridCols, setGridCols, currentSort, currentLimit, updateFilters }) {
    const limits = [9, 12, 18, 24];
    const sortOptions = [
        { value: 'default', label: 'Default sorting' },
        { value: 'popularity', label: 'Sort by popularity' },
        { value: 'average-rating', label: 'Sort by average rating' },
        { value: 'latest', label: 'Sort by latest' },
        { value: 'low-to-high', label: 'Sort by price: low to high' },
        { value: 'high-to-low', label: 'Sort by price: high to low' }
    ];
    return (
        <div className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-gray-100 select-none">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900">
                {heading}
            </h1>
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 ml-auto w-full sm:w-auto justify-between sm:justify-end">
                <div className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-gray-500">
                    <span>Show:</span>
                    {limits.map((limit, idx) => (
                        <React.Fragment key={limit}>
                            <button
                                onClick={() => updateFilters({ limit })}
                                className={`transition-colors duration-150 ${currentLimit === limit ? 'font-bold text-gray-900' : 'hover:text-gray-900 text-gray-400'}`}
                            >
                                {limit}
                            </button>
                            {idx < limits.length - 1 && <span className="text-gray-300">/</span>}
                        </React.Fragment>
                    ))}
                </div>
                <div className="flex items-center gap-2 border-l border-r border-gray-200 px-4 h-5">
                    <button
                        onClick={() => setGridCols(3)}
                        className={`transition-colors duration-150 ${gridCols === 3 ? 'text-[#6C47FF]' : 'text-gray-400 hover:text-gray-900'}`}
                        aria-label="3 columns grid"
                    >
                        <Grid3X3 size={18} />
                    </button>
                    <button
                        onClick={() => setGridCols(4)}
                        className={`transition-colors duration-150 ${gridCols === 4 ? 'text-[#6C47FF]' : 'text-gray-400 hover:text-gray-900'}`}
                        aria-label="4 columns grid"
                    >
                        <Grid2X2 size={18} />
                    </button>
                </div>
                <div className="relative min-w-[160px] sm:min-w-[180px]">
                    <select
                        value={currentSort}
                        onChange={(e) => updateFilters({ sort: e.target.value })}
                        className="w-full bg-white border border-gray-200 rounded px-3 py-1.5 text-xs sm:text-sm font-medium text-gray-700 shadow-sm focus:outline-none focus:border-[#6C47FF] appearance-none cursor-pointer"
                    >
                        {sortOptions.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    );
}