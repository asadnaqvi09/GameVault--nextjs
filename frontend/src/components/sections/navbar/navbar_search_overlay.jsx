"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faXmark } from "@fortawesome/free-solid-svg-icons";
import GameDetails from "@/data/game_details.json";

const searchSections = [
    { title: "Discount", filter: (g) => g.price < g.oldPrice },
    { title: "Award Winner", filter: (g) => g.tags?.includes("Award Winner") },
    { title: "PlayStation 5", filter: (g) => g.options?.platforms?.includes("PS5") },
    { title: "Xbox", filter: (g) => g.options?.platforms?.includes("Xbox Series X/S") },
];

export default function SearchOverlay({ isOpen, onClose }) {
    useEffect(() => {
        const handleEsc = (e) => { if (e.key === "Escape") onClose(); };
        if (isOpen) window.addEventListener("keydown", handleEsc);
        return () => window.removeEventListener("keydown", handleEsc);
    }, [isOpen, onClose]);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-[200] bg-white"
                    />
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 z-[201] overflow-y-auto"
                    >
                        <div className="max-w-[1200px] mx-auto px-6 py-2">
                            <div className="flex items-center justify-end mb-2">
                                <button
                                    onClick={onClose}
                                    className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-[#222] transition-colors"
                                >
                                    <FontAwesomeIcon icon={faXmark} className="text-[22px] cursor-pointer" />
                                </button>
                            </div>

                            <div className="flex items-center h-[56px] w-full overflow-hidden rounded-full border border-gray-200 bg-white px-6 mb-8 focus-within:border-[#6C47FF] transition-all">
                                <FontAwesomeIcon icon={faMagnifyingGlass} className="text-[18px] text-gray-400 mr-4" />
                                <input
                                    type="text"
                                    placeholder="Search for products"
                                    className="h-full w-full border-none bg-transparent text-[16px] outline-none text-[#222] placeholder:text-gray-400"
                                    autoFocus
                                    onKeyDown={(e) => { if (e.key === "Escape") onClose(); }}
                                />
                                <button className="flex h-[36px] items-center w-[36px] rounded-full shrink-0 justify-center bg-[#6C47FF] text-white hover:bg-[#5b3ae6] transition-colors cursor-pointer">
                                    <FontAwesomeIcon icon={faMagnifyingGlass} className="text-[16px]" />
                                </button>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                {searchSections.map((section) => (
                                    <div key={section.title}>
                                        <h3 className="text-[15px] font-bold text-[#222] mb-4">{section.title}</h3>
                                        <div className="space-y-4">
                                            {GameDetails.filter(section.filter).slice(0, 3).map((game) => (
                                                <Link
                                                    key={game.id}
                                                    href={`/games/${game.id}`}
                                                    onClick={onClose}
                                                    className="flex items-start gap-3 group"
                                                >
                                                    <div className="w-16 h-20 rounded-lg bg-gray-100 overflow-hidden shrink-0 relative">
                                                        <Image
                                                            src={`/games/${game.id}/cover.jpg`}
                                                            alt={game.title}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-[14px] font-semibold text-[#222] group-hover:text-[#6C47FF] transition-colors line-clamp-1">
                                                            {game.title}
                                                        </p>
                                                        <div className="flex items-center gap-0.5 mt-1">
                                                            {[1, 2, 3, 4, 5].map((star) => (
                                                                <svg
                                                                    key={star}
                                                                    className={`w-3.5 h-3.5 ${star <= Math.round(game.rating || 0) ? "text-amber-400 fill-amber-400" : "text-gray-300 fill-gray-300"}`}
                                                                    viewBox="0 0 20 20"
                                                                >
                                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                                </svg>
                                                            ))}
                                                        </div>
                                                        <p className="text-[14px] font-bold text-[#6C47FF] mt-1">${game.price}</p>
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}