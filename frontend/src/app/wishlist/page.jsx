'use client';

import React from 'react';
import { useWishlist } from '@/hooks/useWishlist';
import { X, CheckSquare, Square, Trash2 } from 'lucide-react';

export default function WishlistPage() {
    const {
        wishlistItems,
        selectedCount,
        removeOne,
        toggleSelect,
        clearSelected,
        clearAll,
        isSelected
    } = useWishlist();

    if (wishlistItems.length === 0) {
        return (
            <main className='py-20 px-4 flex flex-col items-center justify-center text-center gap-4'>
                <h1 className='text-2xl font-semibold uppercase text-gray-400'>
                    Your Products Wishlist
                </h1>
                <p className='text-gray-500 font-medium'>
                    No products/games in catalogue wishlist
                </p>
            </main>
        );
    }

    return (
        <main className='py-6 px-4 gap-10 flex flex-col max-w-7xl mx-auto w-full'>
            <div className="wishlist-header flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center border-b border-gray-200 pb-4">
                <h1 className='text-2xl font-semibold uppercase tracking-wide text-gray-800'>
                    Your Products Wishlist ({wishlistItems.length})
                </h1>
                <div className="cta flex gap-3 w-full sm:w-auto">
                    {selectedCount > 0 && (
                        <button
                            onClick={clearSelected}
                            className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-sm font-medium rounded transition-colors"
                        >
                            <Trash2 size={16} />
                            Clear Selected ({selectedCount})
                        </button>
                    )}
                    <button
                        onClick={clearAll}
                        className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded transition-colors ml-auto sm:ml-0"
                    >
                        Clear All
                    </button>
                </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {wishlistItems.map((product) => {
                    const isCardSelected = isSelected(product.id);
                    return (
                        <div
                            key={product.id}
                            className={`group relative flex flex-col border rounded-lg overflow-hidden bg-white shadow-sm transition-all duration-200 ${isCardSelected ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-gray-200'
                                }`}
                        >
                            <div className="flex justify-between items-center px-3 py-2 bg-gray-50 border-b border-gray-100">
                                <button
                                    onClick={() => removeOne(product.id)}
                                    className="flex items-center gap-1 text-gray-500 hover:text-red-600 font-medium text-xs uppercase tracking-wider transition-colors"
                                >
                                    <X size={14} />
                                    Remove
                                </button>
                                <button
                                    onClick={() => toggleSelect(product.id)}
                                    className="text-gray-400 hover:text-blue-600 transition-colors"
                                >
                                    {isCardSelected ? (
                                        <CheckSquare size={18} className="text-blue-600" />
                                    ) : (
                                        <Square size={18} />
                                    )}
                                </button>
                            </div>
                            <div className="relative aspect-[3/4] w-full overflow-hidden bg-gray-100">
                                {product.isHot && (
                                    <span className="absolute top-3 left-3 bg-white text-black text-xs font-bold px-2.5 py-1 rounded-full uppercase shadow-sm z-10">
                                        Hot
                                    </span>
                                )}
                                <img
                                    src={product.image || "/placeholder-game.jpg"}
                                    alt={product.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                            </div>
                            <div className="p-4 flex flex-col gap-2 flex-grow">
                                <div className="flex justify-between items-start gap-2">
                                    <h3 className="font-semibold text-lg text-gray-900 line-clamp-1">
                                        {product.title}
                                    </h3>
                                    {product.rating && (
                                        <div className="flex items-center gap-1 text-sm font-medium text-gray-600 shrink-0">
                                            <span>{product.rating.toFixed(1)}</span>
                                            <span className="text-amber-400">★</span>
                                        </div>
                                    )}
                                </div>
                                <button className="mt-auto w-full py-2.5 text-center text-sm font-semibold border border-gray-300 rounded hover:bg-gray-50 transition-colors">
                                    Select Options
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </main>
    );
}