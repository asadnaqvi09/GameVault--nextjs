"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faInstagram,
    faYoutube,
    faTiktok,
    faDiscord,
} from "@fortawesome/free-brands-svg-icons";
import {
    faChevronDown,
    faGamepad,
    faWandMagicSparkles,
    faMagnifyingGlass,
    faUser,
    faHeart,
    faCartShopping,
    faXmark,
} from "@fortawesome/free-solid-svg-icons";

function Navbar() {
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isGamesOpen, setIsGamesOpen] = useState(false);
    const navLinks = [
        { id: 1, name: "Home", link: "/" },
        { id: 2, name: "Games", link: "/games" },
        { id: 3, name: "Sale", link: "/sale" },
    ];
    const socials = [
        { id: 1, icon: faInstagram, hover: "hover:bg-pink-500" },
        { id: 2, icon: faYoutube, hover: "hover:bg-red-500" },
        { id: 3, icon: faTiktok, hover: "hover:bg-black" },
        { id: 4, icon: faDiscord, hover: "hover:bg-indigo-500" },
    ];
    const allGames = [
        "New releases",
        "Top sellers",
        "Preorder",
        "Under $10",
        "Under $20",
    ];
    const platforms = [
        "PC",
        "PlayStation 5",
        "Xbox Series X|S",
        "Nintendo Switch",
    ];
    const genres = [
        "Action",
        "Adventure",
        "Casual",
        "Horror",
        "Indie",
        "Racing",
        "Simulation",
        "RPG",
    ];

    return (
        <>
            <header className="sticky top-0 left-0 z-50 w-full border-b border-gray-200 bg-white drop-shadow-md">
                <div className="relative mx-auto flex h-[88px] w-full max-w-[1600px] items-center justify-between px-4 lg:px-6 2xl:px-8">
                    <div className="flex items-center gap-6 xl:gap-8 2xl:gap-14 h-full">
                        <Link href="/" className="flex items-center shrink-0">
                            <div className="text-xl font-black tracking-tight text-[#6C47FF]">
                                <FontAwesomeIcon icon={faGamepad} className="text-xl" /> GameVault
                            </div>
                        </Link>
                        <nav className="hidden lg:flex items-center gap-6 xl:gap-8 h-full">
                            {navLinks.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex items-center h-full"
                                    onMouseEnter={() => item.name === "Games" && setIsGamesOpen(true)}
                                    onMouseLeave={() => item.name === "Games" && setIsGamesOpen(false)}
                                >
                                    <Link
                                        href={item.link}
                                        className={`flex items-center gap-2 text-[16px] font-semibold transition-all duration-300 ${
                                            item.name === "Home" ? "text-[#6C47FF]" : "text-[#222]"
                                        }`}
                                    >
                                        {item.name}
                                        {item.name !== "Sale" && item.name !== "Home" && (
                                            <FontAwesomeIcon icon={faChevronDown} className="text-[11px]" />
                                        )}
                                    </Link>
                                </div>
                            ))}
                        </nav>
                    </div>
                    <div className="flex items-center gap-3 xl:gap-4 2xl:gap-5">
                        <div className="flex items-center gap-3">
                            {socials.map((item) => (
                                <div
                                    key={item.id}
                                    className={`flex h-[42px] w-[42px] cursor-pointer items-center justify-center rounded-full bg-gray-100 text-gray-600 transition-all duration-300 hover:text-white ${item.hover}`}
                                >
                                    <FontAwesomeIcon icon={item.icon} className="text-[18px]" />
                                </div>
                            ))}
                        </div>
                        <div className="hidden xl:flex h-[46px] w-[280px] 2xl:w-[420px] items-center overflow-hidden rounded-full border border-gray-200 bg-white">
                            <input
                                type="text"
                                placeholder="Search for products"
                                className="h-full w-full border-none px-6 text-[16px] outline-none"
                            />
                            <button className="mr-2 flex h-[36px] w-[45px] items-center justify-center rounded-full bg-[#6C47FF] text-white">
                                <FontAwesomeIcon icon={faMagnifyingGlass} className="text-[16px]" />
                            </button>
                        </div>
                        <div className="hidden xl:block h-10 w-[1px] bg-gray-200" />
                        <div className="flex items-center gap-4 xl:gap-5 2xl:gap-6">
                            <button className="text-[#222] cursor-pointer hover:text-gray-600 transition-all duration-300">
                                <FontAwesomeIcon icon={faUser} className="text-[22px]" />
                            </button>
                            <button className="text-[#222] flex items-center gap-1 cursor-pointer hover:text-gray-600 transition-all duration-300">
                                <FontAwesomeIcon icon={faHeart} className="text-[22px]" />
                                <span className="text-md font-medium">0</span>
                            </button>
                            <button
                                onClick={() => setIsCartOpen(true)}
                                className="flex items-center gap-3 text-[#222] cursor-pointer hover:text-gray-600 transition-all duration-300"
                            >
                                <FontAwesomeIcon icon={faCartShopping} className="text-[22px]" />
                                <p className="hidden xl:block text-[16px] font-medium">0 / $0.00</p>
                            </button>
                        </div>
                    </div>

                    {/* FIX 3: Moved Mega Dropdown out of the inner link loop so width alterations do not break layouts.
                        It is now correctly anchored to the top container row border. */}
                    <AnimatePresence mode="wait">
                        {isGamesOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                transition={{ duration: 0.2, ease: "easeOut" }}
                                onMouseEnter={() => setIsGamesOpen(true)}
                                onMouseLeave={() => setIsGamesOpen(false)}
                                className="absolute top-[88px] left-4 right-4 z-50 border border-gray-100 bg-white px-8 py-6 rounded-b-2xl shadow-[0_25px_60px_rgba(0,0,0,0.18)] text-left"
                            >
                                <div className="grid grid-cols-12 gap-6">
                                    <div className="col-span-2">
                                        <div className="mb-4 flex items-center gap-2 border-b border-gray-100 pb-2">
                                            <FontAwesomeIcon icon={faGamepad} className="text-lg text-[#7C4DFF]" />
                                            <h3 className="text-[16px] font-bold text-[#222]">All games</h3>
                                        </div>
                                        <div className="space-y-2.5">
                                            {allGames.map((game, index) => (
                                                <p key={index} className="cursor-pointer text-[14px] font-medium text-gray-500 transition-all hover:text-[#7C4DFF]">
                                                    {game}
                                                </p>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="col-span-2">
                                        <div className="mb-4 flex items-center gap-2 border-b border-gray-100 pb-2">
                                            <FontAwesomeIcon icon={faGamepad} className="text-lg text-[#7C4DFF]" />
                                            <h3 className="text-[16px] font-bold text-[#222]">By platform</h3>
                                        </div>
                                        <div className="space-y-2.5">
                                            {platforms.map((platform, index) => (
                                                <p key={index} className="cursor-pointer text-[14px] font-medium text-gray-500 transition-all hover:text-[#7C4DFF]">
                                                    {platform}
                                                </p>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="col-span-2">
                                        <div className="mb-4 flex items-center gap-2 border-b border-gray-100 pb-2">
                                            <FontAwesomeIcon icon={faWandMagicSparkles} className="text-lg text-[#7C4DFF]" />
                                            <h3 className="text-[16px] font-bold text-[#222]">By genre</h3>
                                        </div>
                                        <div className="space-y-2.5 max-h-[260px] overflow-y-auto pr-1">
                                            {genres.map((genre, index) => (
                                                <p key={index} className="cursor-pointer text-[14px] font-medium text-gray-500 transition-all hover:text-[#7C4DFF]">
                                                    {genre}
                                                </p>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="col-span-6 relative min-h-[300px] overflow-hidden rounded-xl bg-[#0b031a]">
                                        <Image
                                            src="https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1200&auto=format&fit=crop"
                                            alt="banner"
                                            fill
                                            priority
                                            sizes="50vw"
                                            className="object-cover object-right opacity-90"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent p-8 flex flex-col justify-center items-start">
                                            <p className="mb-2 text-xs xl:text-sm font-medium text-gray-300 tracking-wide">
                                                Hurry up to get a discount <span className="text-red-400 font-semibold">-49%</span>
                                            </p>
                                            <h2 className="mb-3 text-2xl xl:text-3xl font-extrabold leading-tight text-white max-w-[85%]">
                                                Tiny Tina’s Wonderlands
                                            </h2>
                                            <p className="mb-6 text-xs xl:text-sm leading-relaxed text-gray-300 max-w-[80%] line-clamp-3">
                                                Embark on an epic adventure full of whimsy, wonder, and high-powered weaponry! Roll your own multiclass hero then shoot, loot, slash, and cast on a quest to stop the Dragon Lord.
                                            </p>
                                            <button className="rounded-full bg-[#7C4DFF] px-6 py-2.5 text-xs xl:text-sm font-bold text-white shadow-lg transition-all hover:bg-[#6933ff] hover:scale-105 active:scale-95">
                                                Shop Now
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </header>
            <AnimatePresence mode="wait">
                {isCartOpen && (
                    <>
                        <motion.div
                            initial={false}
                            animate={{ opacity: 1, x: 0}}
                            exit={{ opacity: 0, x: "100%" }}
                            onClick={() => setIsCartOpen(false)}
                            className="fixed inset-0 z-[90] bg-black/40 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", damping: 26, stiffness: 260 }}
                            className="fixed right-0 top-0 z-[100] h-screen w-full sm:w-[420px] bg-white shadow-2xl"
                        >
                            <div className="flex items-center justify-between border-b border-gray-200 p-6">
                                <h2 className="text-2xl font-bold text-[#222]">Shopping Cart</h2>
                                <button
                                    onClick={() => setIsCartOpen(false)}
                                    className="rounded-full bg-gray-100 p-2 transition-all hover:bg-[#6C47FF] hover:text-white"
                                >
                                    <FontAwesomeIcon icon={faXmark} className="text-[20px]" />
                                </button>
                            </div>
                            <div className="flex h-[80%] flex-col items-center justify-center px-10 text-center">
                                <FontAwesomeIcon icon={faCartShopping} className="mb-5 text-[70px] text-gray-300" />
                                <h3 className="mb-3 text-2xl font-bold text-[#222]">Your cart is empty</h3>
                                <p className="text-gray-500">Add some awesome games to your cart.</p>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
export default Navbar;