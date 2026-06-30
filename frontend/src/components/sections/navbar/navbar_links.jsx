"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

const navLinks = [
    { id: 1, name: "Home", link: "/" },
    { id: 2, name: "Games", link: "/games" },
    { id: 3, name: "Sale", link: "/on-sale" },
];

export default function NavLinks({ isGamesOpen, onGamesEnter, onGamesLeave }) {
    const pathname = usePathname();
    return (
        <nav className="flex items-center gap-6 xl:gap-8 h-full">
            {navLinks.map((item) => {
                const isActive = pathname === item.link;
                return (
                    <div
                        key={item.id}
                        className="flex items-center h-full relative"
                        onMouseEnter={() => item.name === "Games" && onGamesEnter()}
                        onMouseLeave={() => item.name === "Games" && onGamesLeave()}
                    >
                        <Link
                            href={item.link}
                            className={`flex items-center gap-1.5 text-[15px] font-semibold transition-colors duration-200 cursor-pointer ${isActive ? "text-[#6C47FF]" : "text-[#222] hover:text-[#6C47FF]"}`}
                        >
                            {item.name}
                            {item.name === "Games" && (
                                <ChevronDown
                                    className={`w-3.5 h-3.5 transition-transform duration-200 ${isGamesOpen ? "rotate-180 text-[#6C47FF]" : "text-gray-400"}`}
                                />
                            )}
                        </Link>
                        {isActive && (
                            <motion.div
                                layoutId="activeIndicator"
                                className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#6C47FF] rounded-t-full"
                            />
                        )}
                    </div>
                );
            })}
        </nav>
    );
}
