"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGamepad, faWandMagicSparkles } from "@fortawesome/free-solid-svg-icons";

const allGames = ["New releases", "Top sellers", "Preorder", "Under $10", "Under $20"];
const platforms = ["PC", "PlayStation 5", "Xbox Series X|S", "Nintendo Switch"];
const genres = ["Action", "Adventure", "Casual", "Horror", "Indie", "Racing", "Simulation", "RPG"];

export default function GamesDropdown({ onMouseEnter, onMouseLeave }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
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
                            <p key={index} className="cursor-pointer text-[14px] font-medium text-gray-600 transition-colors hover:text-[#6C47FF]">
                                {game}
                            </p>
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
                            <p key={index} className="cursor-pointer text-[14px] font-medium text-gray-600 transition-colors hover:text-[#6C47FF]">
                                {platform}
                            </p>
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
                            <p key={index} className="cursor-pointer text-[14px] font-medium text-gray-600 transition-colors hover:text-[#6C47FF]">
                                {genre}
                            </p>
                        ))}
                    </div>
                </div>

                <div className="col-span-6 relative min-h-[280px] overflow-hidden rounded-xl bg-[#0b031a]">
                    <Image
                        src="https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1200&auto=format&fit=crop"
                        alt="Featured game banner"
                        fill
                        priority
                        sizes="40vw"
                        className="object-cover object-right opacity-80"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent p-8 flex flex-col justify-center items-start">
                        <p className="mb-1.5 text-xs font-semibold text-amber-400 tracking-wider uppercase">
                            Save <span className="font-bold">-49%</span> Today
                        </p>
                        <h2 className="mb-2 text-2xl font-black leading-tight text-white max-w-[85%]">
                            Tiny Tina's Wonderlands
                        </h2>
                        <p className="mb-5 text-xs leading-relaxed text-gray-300 max-w-[80%] line-clamp-2">
                            Embark on an epic adventure full of whimsy, wonder, and high-powered weaponry! Roll your own multiclass hero then shoot, loot, slash, and cast.
                        </p>
                        <button className="rounded-full bg-[#6C47FF] px-6 py-2.5 text-xs font-bold text-white shadow-md transition-all hover:bg-[#5b3ae6] hover:scale-102 active:scale-98">
                            Shop Now
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}