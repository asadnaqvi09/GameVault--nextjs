"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faCartShopping } from "@fortawesome/free-solid-svg-icons";

export function WishlistButton({ count = 0 }) {
    return (
        <button
            className="text-[#222] flex items-center gap-1.5 hover:text-[#6C47FF] transition-colors duration-200 focus:outline-none"
            aria-label="Wishlist"
        >
            <FontAwesomeIcon icon={faHeart} className="text-[20px]" />
            <span className="text-sm font-semibold bg-gray-100 px-2 py-0.5 rounded-full text-gray-700 text-xs">
                {count}
            </span>
        </button>
    );
}

export function CartButton({ count = 0, total = "0.00", onOpen }) {
    return (
        <button
            onClick={onOpen}
            className="flex items-center gap-2 text-[#222] hover:text-[#6C47FF] transition-colors duration-200 focus:outline-none"
            aria-label="Cart"
        >
            <FontAwesomeIcon icon={faCartShopping} className="text-[20px]" />
            <p className="hidden xl:block text-[14px] font-semibold text-gray-700">
                {count} / <span className="text-[#222]">${total}</span>
            </p>
        </button>
    );
}