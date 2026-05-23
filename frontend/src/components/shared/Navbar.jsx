"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInstagram, faYoutube, faTiktok, faDiscord } from "@fortawesome/free-brands-svg-icons";
import {
    faChevronDown,
    faGamepad,
    faWandMagicSparkles,
    faMagnifyingGlass,
    faUser,
    faHeart,
    faCartShopping,
    faXmark,
    faBars,
    faUserShield,
    faUserGear,
    faRightFromBracket
} from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "@/hooks/useAuth";

export default function Navbar() {
    const router = useRouter();
    const pathname = usePathname();
    const { user, isAuthenticated, logout } = useAuth();
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isGamesOpen, setIsGamesOpen] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [mobileTab, setMobileTab] = useState("Menu");
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const navLinks = [
        { id: 1, name: "Home", link: "/" },
        { id: 2, name: "Games", link: "/games" },
        { id: 3, name: "Sale", link: "/sale" }
    ];
    const socials = [
        { id: 1, icon: faInstagram, hover: "hover:bg-pink-500" },
        { id: 2, icon: faYoutube, hover: "hover:bg-red-500" },
        { id: 3, icon: faTiktok, hover: "hover:bg-black" },
        { id: 4, icon: faDiscord, hover: "hover:bg-indigo-500" }
    ];
    const allGames = ["New releases", "Top sellers", "Preorder", "Under $10", "Under $20"];
    const platforms = ["PC", "PlayStation 5", "Xbox Series X|S", "Nintendo Switch"];
    const genres = ["Action", "Adventure", "Casual", "Horror", "Indie", "Racing", "Simulation", "RPG"];
    const handleLogout = async () => {
        await logout();
        setIsMobileOpen(false);
        setIsDrawerOpen(false);
        router.push("/");
    };
    const mobileMenu = [
        { name: "Home", link: "/" },
        { name: "Games", link: "/games" },
        { name: "Sale", link: "/sale" },
        { name: "About Us", link: "/about-us" },
        { name: "Contact Us", link: "/contact" },
        { name: "Wishlist", link: "/wishlist" },
        ...(!isAuthenticated ? [{ name: "Login/Register", link: "/auth" }] : []),
    ];

    return (
        <>
            <header className="sticky top-0 left-0 z-50 w-full border-b border-gray-100 bg-white/95 backdrop-blur-md shadow-sm">
                <div className="mobileDiv lg:hidden flex flex-col w-full px-4 py-3 gap-3">
                    <Link href="/" className="flex items-center justify-center shrink-0">
                        <div className="text-xl font-black tracking-tight text-[#6C47FF]">
                            <FontAwesomeIcon icon={faGamepad} className="text-xl mr-2" />GameVault
                        </div>
                    </Link>
                    <div className="flex items-center justify-between gap-4">
                        <button
                            onClick={() => setIsMobileOpen(true)}
                            className="text-[#222] text-[24px] w-10 h-10 flex items-center justify-start focus:outline-none"
                            aria-label="Open Menu"
                        >
                            <FontAwesomeIcon icon={faBars} />
                        </button>
                        <div className="flex h-[40px] flex-1 items-center overflow-hidden rounded-full border border-gray-200 bg-gray-50 px-4 focus-within:border-[#6C47FF] focus-within:bg-white transition-all">
                            <input type="text" placeholder="Search games..." className="h-full w-full border-none bg-transparent text-[14px] outline-none text-[#222]" />
                            <button className="text-[#6C47FF] p-1"><FontAwesomeIcon icon={faMagnifyingGlass} /></button>
                        </div>
                        <button
                            onClick={() => setIsCartOpen(true)}
                            className="text-[#222] text-[22px] w-10 h-10 flex items-center justify-end focus:outline-none relative"
                            aria-label="Open Cart"
                        >
                            <FontAwesomeIcon icon={faCartShopping} />
                        </button>
                    </div>
                </div>

                <div className="webDiv relative mx-auto hidden lg:flex h-[88px] w-full max-w-[1600px] items-center justify-between px-6 2xl:px-8">
                    <div className="flex items-center gap-6 xl:gap-8 2xl:gap-14 h-full">
                        <Link href="/" className="flex items-center shrink-0">
                            <div className="text-xl font-black tracking-tight text-[#6C47FF] cursor-pointer">
                                <FontAwesomeIcon icon={faGamepad} className="text-xl mr-2" />GameVault
                            </div>
                        </Link>

                        <nav className="flex items-center gap-6 xl:gap-8 h-full">
                            {navLinks.map((item) => {
                                const isActive = pathname === item.link;
                                return (
                                    <div
                                        key={item.id}
                                        className="flex items-center h-full relative"
                                        onMouseEnter={() => item.name === "Games" && setIsGamesOpen(true)}
                                        onMouseLeave={() => item.name === "Games" && setIsGamesOpen(false)}
                                    >
                                        <Link
                                            href={item.link}
                                            className={`flex items-center gap-2 text-[15px] font-semibold transition-colors duration-200 cursor-pointer ${isActive ? "text-[#6C47FF]" : "text-[#222] hover:text-[#6C47FF]"
                                                }`}
                                        >
                                            {item.name}
                                            {item.name === "Games" && (
                                                <FontAwesomeIcon
                                                    icon={faChevronDown}
                                                    className={`text-[10px] transition-transform duration-200 ${isGamesOpen ? "rotate-180 text-[#6C47FF]" : "text-gray-400"}`}
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
                    </div>

                    <div className="flex items-center gap-3 xl:gap-4 2xl:gap-5">
                        <div className="flex items-center gap-2">
                            {socials.map((item) => (
                                <div key={item.id} className={`flex h-[38px] w-[38px] cursor-pointer items-center justify-center rounded-full bg-gray-50 text-gray-500 transition-all duration-200 hover:text-white ${item.hover}`}>
                                    <FontAwesomeIcon icon={item.icon} className="text-[16px]" />
                                </div>
                            ))}
                        </div>

                        <div className="hidden xl:flex h-[44px] w-[260px] 2xl:w-[380px] items-center overflow-hidden rounded-full border border-gray-200 bg-white focus-within:border-[#6C47FF] focus-within:ring-2 focus-within:ring-[#6C47FF]/10 transition-all">
                            <input type="text" placeholder="Search for products..." className="h-full w-full border-none px-5 text-[14px] outline-none text-[#222]" />
                            <button className="mr-1.5 flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-full bg-[#6C47FF] text-white hover:bg-[#5b3ae6] transition-colors">
                                <FontAwesomeIcon icon={faMagnifyingGlass} className="text-[14px]" />
                            </button>
                        </div>

                        <div className="hidden xl:block h-8 w-[1px] bg-gray-200" />

                        <div className="flex items-center gap-4 xl:gap-5">
                            {isAuthenticated ? (
                                <div className="relative">
                                    <button
                                        onClick={() => setIsDrawerOpen(!isDrawerOpen)}
                                        className="text-[#222] hover:text-[#6C47FF] transition-colors duration-200 flex items-center gap-2 text-[14px] font-medium focus:outline-none py-2"
                                    >
                                        <FontAwesomeIcon icon={faUser} className="text-[20px]" />
                                        <span className="hidden xl:inline max-w-[120px] truncate">{user?.userName || "Account"}</span>
                                        <FontAwesomeIcon
                                            icon={faChevronDown}
                                            className={`text-[10px] text-gray-400 transition-transform duration-200 ${isDrawerOpen ? "rotate-180" : ""}`}
                                        />
                                    </button>

                                    <AnimatePresence>
                                        {isDrawerOpen && (
                                            <>
                                                <div className="fixed inset-0 z-40" onClick={() => setIsDrawerOpen(false)} />

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

                                                    {user?.role === "admin" ? (
                                                        <Link
                                                            href="/admin"
                                                            onClick={() => setIsDrawerOpen(false)}
                                                            className="flex items-center gap-3 px-4 py-3 text-[14px] font-medium text-amber-600 hover:bg-amber-50 transition-colors w-full text-left"
                                                        >
                                                            <FontAwesomeIcon icon={faUserShield} className="text-base text-amber-500" />
                                                            Admin Panel
                                                        </Link>
                                                    ) : (
                                                        <button
                                                            onClick={() => setIsDrawerOpen(false)}
                                                            className="flex items-center gap-3 px-4 py-3 text-[14px] font-medium text-gray-600 hover:bg-gray-50 transition-colors w-full text-left cursor-default"
                                                        >
                                                            <FontAwesomeIcon icon={faUserGear} className="text-base text-gray-400" />
                                                            My Profile <span className="text-[10px] bg-purple-100 text-[#6C47FF] px-1.5 py-0.2 rounded font-semibold ml-auto">Soon</span>
                                                        </button>
                                                    )}

                                                    <hr className="border-gray-100 my-1" />

                                                    <button
                                                        onClick={handleLogout}
                                                        className="flex items-center gap-3 px-4 py-3 text-[14px] font-medium text-red-600 hover:bg-red-50 transition-colors w-full text-left focus:outline-none"
                                                    >
                                                        <FontAwesomeIcon icon={faRightFromBracket} className="text-base text-red-400" />
                                                        Log Out
                                                    </button>
                                                </motion.div>
                                            </>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ) : (
                                <Link href="/auth" className="text-[#222] hover:text-[#6C47FF] transition-colors duration-200 flex items-center" aria-label="Account">
                                    <FontAwesomeIcon icon={faUser} className="text-[20px]" />
                                </Link>
                            )}

                            <button className="text-[#222] flex items-center gap-1.5 hover:text-[#6C47FF] transition-colors duration-200 focus:outline-none" aria-label="Wishlist">
                                <FontAwesomeIcon icon={faHeart} className="text-[20px]" />
                                <span className="text-sm font-semibold bg-gray-100 px-2 py-0.5 rounded-full text-gray-700 text-xs">0</span>
                            </button>

                            <button onClick={() => setIsCartOpen(true)} className="flex items-center gap-2 text-[#222] hover:text-[#6C47FF] transition-colors duration-200 focus:outline-none" aria-label="Cart">
                                <FontAwesomeIcon icon={faCartShopping} className="text-[20px]" />
                                <p className="hidden xl:block text-[14px] font-semibold text-gray-700">0 / <span className="text-[#222]">$0.00</span></p>
                            </button>
                        </div>
                    </div>

                    <AnimatePresence>
                        {isGamesOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 15 }}
                                transition={{ duration: 0.15, ease: "easeOut" }}
                                onMouseEnter={() => setIsGamesOpen(true)}
                                onMouseLeave={() => setIsGamesOpen(false)}
                                className="absolute top-[88px] left-0 right-0 z-50 border border-gray-100 bg-white px-8 py-8 rounded-b-2xl shadow-[0_20px_40px_rgba(0,0,0,0.08)] text-left"
                            >
                                <div className="grid grid-cols-12 gap-8 max-w-[1520px] mx-auto">
                                    <div className="col-span-2">
                                        <div className="mb-4 flex items-center gap-2 border-b border-gray-50 pb-2">
                                            <FontAwesomeIcon icon={faGamepad} className="text-sm text-[#6C47FF]" />
                                            <h3 className="text-[14px] font-bold uppercase tracking-wider text-gray-400">All games</h3>
                                        </div>
                                        <div className="space-y-3">
                                            {allGames.map((game, index) => (
                                                <p key={index} className="cursor-pointer text-[14px] font-medium text-gray-600 transition-colors hover:text-[#6C47FF]">{game}</p>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="col-span-2">
                                        <div className="mb-4 flex items-center gap-2 border-b border-gray-50 pb-2">
                                            <FontAwesomeIcon icon={faGamepad} className="text-sm text-[#6C47FF]" />
                                            <h3 className="text-[14px] font-bold uppercase tracking-wider text-gray-400">By platform</h3>
                                        </div>
                                        <div className="space-y-3">
                                            {platforms.map((platform, index) => (
                                                <p key={index} className="cursor-pointer text-[14px] font-medium text-gray-600 transition-colors hover:text-[#6C47FF]">{platform}</p>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="col-span-2">
                                        <div className="mb-4 flex items-center gap-2 border-b border-gray-50 pb-2">
                                            <FontAwesomeIcon icon={faWandMagicSparkles} className="text-sm text-[#6C47FF]" />
                                            <h3 className="text-[14px] font-bold uppercase tracking-wider text-gray-400">By genre</h3>
                                        </div>
                                        <div className="space-y-3 max-h-[240px] overflow-y-auto pr-1 scrollbar-thin">
                                            {genres.map((genre, index) => (
                                                <p key={index} className="cursor-pointer text-[14px] font-medium text-gray-600 transition-colors hover:text-[#6C47FF]">{genre}</p>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="col-span-6 relative min-h-[280px] overflow-hidden rounded-xl bg-[#0b031a]">
                                        <Image src="https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1200&auto=format&fit=crop" alt="Featured game banner" fill priority sizes="40vw" className="object-cover object-right opacity-80" />
                                        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent p-8 flex flex-col justify-center items-start">
                                            <p className="mb-1.5 text-xs font-semibold text-amber-400 tracking-wider uppercase">Save <span className="font-bold">-49%</span> Today</p>
                                            <h2 className="mb-2 text-2xl font-black leading-tight text-white max-w-[85%]">Tiny Tina’s Wonderlands</h2>
                                            <p className="mb-5 text-xs leading-relaxed text-gray-300 max-w-[80%] line-clamp-2">Embark on an epic adventure full of whimsy, wonder, and high-powered weaponry! Roll your own multiclass hero then shoot, loot, slash, and cast.</p>
                                            <button className="rounded-full bg-[#6C47FF] px-6 py-2.5 text-xs font-bold text-white shadow-md transition-all hover:bg-[#5b3ae6] hover:scale-102 active:scale-98">Shop Now</button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </header>

            <AnimatePresence>
                {isMobileOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMobileOpen(false)}
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
                                <button onClick={() => setIsMobileOpen(false)} className="rounded-full bg-gray-50 p-2 text-gray-500 hover:bg-gray-100 hover:text-[#222] w-9 h-9 flex items-center justify-center"><FontAwesomeIcon icon={faXmark} className="text-[16px]" /></button>
                            </div>
                            <div className="flex border-b border-gray-100 bg-gray-50/50">
                                <button onClick={() => setMobileTab("Menu")} className={`flex-1 py-3 text-sm font-bold transition-all ${mobileTab === "Menu" ? "bg-white border-b-2 border-[#6C47FF] text-[#6C47FF]" : "text-gray-500 hover:text-[#222]"}`}>Menu</button>
                                <button onClick={() => setMobileTab("Genre")} className={`flex-1 py-3 text-sm font-bold transition-all ${mobileTab === "Genre" ? "bg-white border-b-2 border-[#6C47FF] text-[#6C47FF]" : "text-gray-500 hover:text-[#222]"}`}>Genre</button>
                            </div>
                            <div className="flex-1 overflow-y-auto p-6 cursor-pointer">
                                {mobileTab === "Menu" ? (
                                    <div className="flex flex-col gap-5">
                                        {mobileMenu.map((item, idx) => (
                                            <Link key={idx} href={item.link} onClick={() => setIsMobileOpen(false)} className={`text-[15px] font-semibold ${pathname === item.link ? "text-[#6C47FF]" : "text-[#222] hover:text-[#6C47FF]"}`}>{item.name}</Link>
                                        ))}
                                        {isAuthenticated && (
                                            <>
                                                {user?.role === "admin" ? (
                                                    <Link href="/admin" onClick={() => setIsMobileOpen(false)} className="text-left text-[15px] font-semibold text-amber-600 hover:text-amber-700">Admin Panel</Link>
                                                ) : (
                                                    <span className="text-left text-[15px] font-semibold text-gray-400 cursor-not-allowed">My Profile (Soon)</span>
                                                )}
                                                <button onClick={handleLogout} className="text-left text-[15px] font-semibold text-red-500 hover:text-red-700 focus:outline-none">Logout</button>
                                            </>
                                        )}
                                    </div>
                                ) : (
                                    <div className="flex flex-col gap-5">
                                        {genres.map((genre, idx) => (
                                            <Link key={idx} href={`/genre/${genre.toLowerCase()}`} onClick={() => setIsMobileOpen(false)} className="text-[15px] font-semibold text-[#222] hover:text-[#6C47FF]">{genre}</Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {isCartOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsCartOpen(false)}
                            className="fixed inset-0 z-[90] bg-black/50 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "tween", duration: 0.25, ease: "easeInOut" }}
                            className="fixed right-0 top-0 z-[100] h-screen w-full sm:w-[420px] bg-white shadow-2xl flex flex-col"
                        >
                            <div className="flex items-center justify-between border-b border-gray-100 p-6">
                                <h2 className="text-xl font-bold text-[#222]">Shopping Cart</h2>
                                <button onClick={() => setIsCartOpen(false)} className="rounded-full bg-gray-50 p-2 text-gray-500 hover:bg-gray-100 hover:text-[#222] w-9 h-9 flex items-center justify-center"><FontAwesomeIcon icon={faXmark} className="text-[16px]" /></button>
                            </div>

                            <div className="flex-1 flex flex-col items-center justify-center px-10 text-center">
                                <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6 text-gray-300">
                                    <FontAwesomeIcon icon={faCartShopping} className="text-[36px]" />
                                </div>
                                <h3 className="mb-2 text-xl font-bold text-[#222]">Your cart is empty</h3>
                                <p className="text-sm text-gray-400 max-w-[260px]">Looks like you haven't added any awesome games to your collection yet.</p>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
};