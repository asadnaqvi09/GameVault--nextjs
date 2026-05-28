"use client";

import Link from "next/link";
import { useWishlist } from "@/hooks/useWishlist";
import { Heart, ShoppingCart } from "lucide-react";

export function WishlistButton() {
    const { wishlistCount } = useWishlist();

    return (
        <Link
            href="/wishlist"
            className="text-[#222] relative flex items-center hover:text-[#6C47FF] transition-colors duration-200 focus:outline-none"
            aria-label="Wishlist"
        >
            <Heart className="text-[20px]" />
            <span className="absolute top-[-10px] right-[-8px] text-sm font-semibold bg-gray-100 px-2 py-0.5 rounded-full text-gray-700 text-xs">
                {wishlistCount}
            </span>
        </Link>
    );
}

export function CartButton({ count = 0, total = "0.00", onOpen }) {
    return (
        <button
            onClick={onOpen}
            className="flex items-center gap-2 text-[#222] hover:text-[#6C47FF] transition-colors duration-200 focus:outline-none"
            aria-label="Cart"
        >
            <ShoppingCart className="text-[20px]" />
            <p className="hidden xl:block text-[14px] font-semibold text-gray-700">
                {count} / <span className="text-[#222]">${total}</span>
            </p>
        </button>
    );
}