"use client";

import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGamepad } from "@fortawesome/free-solid-svg-icons";

export default function NavbarLogo() {
    return (
        <Link href="/" className="flex items-center shrink-0">
            <div className="text-xl font-black tracking-tight text-[#6C47FF] cursor-pointer">
                <FontAwesomeIcon icon={faGamepad} className="text-xl mr-2" />GameVault
            </div>
        </Link>
    );
}