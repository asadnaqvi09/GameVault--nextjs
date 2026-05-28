'use client';
import React from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';

export default function Pagination({ totalCount, currentLimit, currentPage, updateFilters }) {
    const totalPages = Math.ceil(totalCount / currentLimit);
    if (totalPages <= 1) return null;
    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            updateFilters({ page });
        }
    };
    return (
        <div className="w-full flex justify-center items-center gap-2 mt-12 select-none">
            {currentPage > 1 && (
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    className="w-10 h-10 flex items-center justify-center text-gray-700 hover:text-[#6C47FF] transition-colors duration-150 font-medium text-sm rounded-md"
                    aria-label="Previous page"
                >
                    <ChevronLeft size={18} />
                </button>
            )}
            {Array.from({ length: totalPages }, (_, index) => {
                const pageNumber = index + 1;
                const isActive = pageNumber === currentPage;
                return (
                    <button
                        key={pageNumber}
                        onClick={() => handlePageChange(pageNumber)}
                        className={`w-10 h-10 flex items-center justify-center font-semibold text-sm rounded-md transition-all duration-150 ${isActive
                                ? 'bg-[#6C47FF] text-white shadow-sm'
                                : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                            }`}
                    >
                        {pageNumber}
                    </button>
                );
            })}
            {currentPage < totalPages && (
                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    className="w-10 h-10 flex items-center justify-center text-gray-700 hover:text-[#6C47FF] transition-colors duration-150 font-medium text-sm rounded-md"
                    aria-label="Next page"
                >
                    <ChevronRight size={18} />
                </button>
            )}
        </div>
    );
}