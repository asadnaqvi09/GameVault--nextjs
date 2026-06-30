"use client";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { User, LogOut, Users, ChevronDown } from 'lucide-react';

export default function UserMenu({ user, isAuthenticated, isDrawerOpen, onToggleDrawer, onCloseDrawer, onLogout }) {
    if (!isAuthenticated) {
        return (
            <Link
                href="/auth"
                className="text-[#222] hover:text-[#6C47FF] transition-colors duration-200 flex items-center cursor-pointer"
                aria-label="Account"
            >
                <User className="text-[20px]" />
            </Link>
        );
    }
    return (
        <div className="relative">
            <button
                onClick={onToggleDrawer}
                className="text-[#222] hover:text-[#6C47FF] transition-colors duration-200 flex items-center gap-2 text-[14px] font-medium focus:outline-none py-2 cursor-pointer"
            >
                <User className="text-[20px]" />
                <span className="hidden xl:inline max-w-[120px] truncate">{user?.userName || "Account"}</span>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isDrawerOpen ? "rotate-180" : ""}`} />
            </button>
            <AnimatePresence>
                {isDrawerOpen && (
                    <>
                        <div className="fixed inset-0 z-40" onClick={onCloseDrawer} />
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            transition={{ duration: 0.15 }}
                            className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 overflow-hidden"
                        >
                            <div className="px-4 py-2.5 border-b border-gray-50 bg-gray-50/50">
                                <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Signed in as</p>
                                <p className="text-sm font-bold text-gray-800 truncate">{user?.userName}</p>
                            </div>
                            {user?.role === "Admin" ? (
                                <Link
                                    href="/admin"
                                    onClick={onCloseDrawer}
                                    className="flex items-center gap-3 px-4 py-3 text-[14px] font-medium text-amber-600 hover:bg-amber-50 transition-colors w-full text-left"
                                >
                                    <Users className="text-base text-amber-500" />
                                    Admin Panel
                                </Link>
                            ) : (
                                <Link
                                    href="/profile"
                                    onClick={onCloseDrawer}
                                    className="flex items-center gap-3 px-4 py-3 text-[14px] font-medium text-gray-600 hover:bg-gray-50 transition-colors w-full text-left"
                                >
                                    <User className="text-base text-gray-400" />
                                    My Profile
                                </Link>
                            )}
                            <hr className="border-gray-100 my-1" />
                            <button
                                onClick={onLogout}
                                className="flex items-center gap-3 px-4 py-3 text-[14px] font-medium text-red-600 hover:bg-red-50 transition-colors w-full text-left focus:outline-none cursor-pointer"
                            >
                                <LogOut className="text-base text-red-400" />
                                Log Out
                            </button>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
