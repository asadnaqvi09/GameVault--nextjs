"use client";

import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGamepad } from "@fortawesome/free-solid-svg-icons";

export default function NavbarLogo() {
    return (
        <Link href="/" className="brand-logo flex items-center gap-2">
            <svg className="w-8 h-8 text-[#6042ef]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
            <span className="brand-name text-xl font-bold text-gray-900 tracking-tight">Game<span className="text-[#6042ef]">Vault</span></span>
        </Link>
    );
}