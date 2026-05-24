"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

const genres = ["Action", "Adventure", "Casual", "Horror", "Indie", "Racing", "Simulation", "RPG"];

export default function MobileDrawer({ isOpen, onClose, mobileTab, onTabChange, mobileMenu, isAuthenticated, user, onLogout }) {
    const pathname = usePathname();

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-[90] bg-black/50 backdrop-blur-sm lg:hidden"
                    />
                    <motion.div
                        initial={{ x: "-100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "-100%" }}
                        transition={{ type: "tween", duration: 0.25, ease: "easeInOut" }}
                        className="fixed left-0 top-0 z-[100] h-screen w-[300px] bg-white shadow-2xl lg:hidden flex flex-col"
                    >
                        <div className="flex items-center justify-between border-b border-gray-100 p-5">
                            <h2 className="text-lg font-bold text-[#222]">Navigation</h2>
                            <button
                                onClick={onClose}
                                className="rounded-full bg-gray-50 p-2 text-gray-500 hover:bg-gray-100 hover:text-[#222] w-9 h-9 flex items-center justify-center"
                            >
                                <FontAwesomeIcon icon={faXmark} className="text-[16px]" />
                            </button>
                        </div>

                        <div className="flex border-b border-gray-100 bg-gray-50/50">
                            <button
                                onClick={() => onTabChange("Menu")}
                                className={`flex-1 py-3 text-sm font-bold transition-all ${mobileTab === "Menu" ? "bg-white border-b-2 border-[#6C47FF] text-[#6C47FF]" : "text-gray-500 hover:text-[#222]"}`}
                            >
                                Menu
                            </button>
                            <button
                                onClick={() => onTabChange("Genre")}
                                className={`flex-1 py-3 text-sm font-bold transition-all ${mobileTab === "Genre" ? "bg-white border-b-2 border-[#6C47FF] text-[#6C47FF]" : "text-gray-500 hover:text-[#222]"}`}
                            >
                                Genre
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 cursor-pointer">
                            {mobileTab === "Menu" ? (
                                <div className="flex flex-col gap-5">
                                    {mobileMenu.map((item, idx) => (
                                        <Link
                                            key={idx}
                                            href={item.link}
                                            onClick={onClose}
                                            className={`text-[15px] font-semibold ${pathname === item.link ? "text-[#6C47FF]" : "text-[#222] hover:text-[#6C47FF]"}`}
                                        >
                                            {item.name}
                                        </Link>
                                    ))}
                                    {isAuthenticated && (
                                        <>
                                            {user?.role === "admin" ? (
                                                <Link
                                                    href="/admin"
                                                    onClick={onClose}
                                                    className="text-left text-[15px] font-semibold text-amber-600 hover:text-amber-700"
                                                >
                                                    Admin Panel
                                                </Link>
                                            ) : (
                                                <span className="text-left text-[15px] font-semibold text-gray-400 cursor-not-allowed">
                                                    My Profile (Soon)
                                                </span>
                                            )}
                                            <button
                                                onClick={onLogout}
                                                className="text-left text-[15px] font-semibold text-red-500 hover:text-red-700 focus:outline-none"
                                            >
                                                Logout
                                            </button>
                                        </>
                                    )}
                                </div>
                            ) : (
                                <div className="flex flex-col gap-5">
                                    {genres.map((genre, idx) => (
                                        <Link
                                            key={idx}
                                            href={`/genre/${genre.toLowerCase()}`}
                                            onClick={onClose}
                                            className="text-[15px] font-semibold text-[#222] hover:text-[#6C47FF]"
                                        >
                                            {genre}
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}