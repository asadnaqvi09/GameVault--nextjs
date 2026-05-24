"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

export default function SearchBar({ onOpen }) {
    return (
        <div className="hidden xl:flex h-[44px] w-[260px] 2xl:w-[380px] items-center overflow-hidden rounded-full border border-gray-200 bg-white focus-within:border-[#6C47FF] focus-within:ring-2 focus-within:ring-[#6C47FF]/10 transition-all">
            <button
                onClick={onOpen}
                className="h-full w-full border-none px-5 text-[14px] outline-none text-gray-400 text-left transition-all cursor-pointer hover:bg-gray-50 flex items-center"
            >
                Search for products
            </button>
            <button
                onClick={onOpen}
                className="mr-1.5 flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-full bg-[#6C47FF] text-white hover:bg-[#5b3ae6] transition-colors cursor-pointer"
            >
                <FontAwesomeIcon icon={faMagnifyingGlass} className="text-[14px]" />
            </button>
        </div>
    );
}