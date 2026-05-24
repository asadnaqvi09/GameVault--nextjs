"use client";

import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGamepad, faBars, faMagnifyingGlass, faCartShopping } from "@fortawesome/free-solid-svg-icons";

export default function MobileHeader({ onMenuOpen, onCartOpen }) {
    return (
        <div className="lg:hidden flex flex-col w-full px-4 py-3 gap-3">
            <Link href="/" className="flex items-center justify-center shrink-0">
                <div className="text-xl font-black tracking-tight text-[#6C47FF]">
                    <FontAwesomeIcon icon={faGamepad} className="text-xl mr-2" />GameVault
                </div>
            </Link>
            <div className="flex items-center justify-between gap-4">
                <button
                    onClick={onMenuOpen}
                    className="text-[#222] text-[24px] w-10 h-10 flex items-center justify-start focus:outline-none"
                    aria-label="Open Menu"
                >
                    <FontAwesomeIcon icon={faBars} />
                </button>
                <div className="flex h-[40px] flex-1 items-center overflow-hidden rounded-full border border-gray-200 bg-gray-50 px-4 focus-within:border-[#6C47FF] focus-within:bg-white transition-all cursor-pointer">
                    <input
                        type="text"
                        placeholder="Search games..."
                        className="h-full w-full border-none bg-transparent text-[14px] outline-none text-[#222]"
                    />
                    <button className="text-[#6C47FF] p-1">
                        <FontAwesomeIcon icon={faMagnifyingGlass} />
                    </button>
                </div>
                <button
                    onClick={onCartOpen}
                    className="text-[#222] text-[22px] w-10 h-10 flex items-center justify-end focus:outline-none relative"
                    aria-label="Open Cart"
                >
                    <FontAwesomeIcon icon={faCartShopping} />
                </button>
            </div>
        </div>
    );
}