"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function BlogCard({
    id,
    title,
    category,
    date,
    bgImage,
    author
}) {
    const router = useRouter();

    const [dateNum, dateMonth] = date.split(" ");

    const handleCardClick = () => {
        router.push(`/blogs/${id}`);
    };

    const stopPropagation = (e) => {
        e.stopPropagation();
    };

    return (
        <div
            id={`blog-card-instance-${id}`}
            onClick={handleCardClick}
            className="article-card group relative block w-full aspect-[4/3] rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 cursor-pointer select-none"
        >
            <Image
                src={bgImage}
                alt={title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                className="article-bg-image object-cover transition-transform duration-500 group-hover:scale-105"
            />

            <div className="article-overlay absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-black/20" />

            <div className="article-date-badge absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-2 flex flex-col items-center justify-center min-w-[48px] text-center shadow-sm z-10">
                <span className="date-number text-xl font-bold text-[#111111] leading-none">
                    {dateNum}
                </span>
                <span className="date-month text-[10px] font-bold text-gray-500 tracking-wider mt-0.5 uppercase">
                    {dateMonth?.replace(",", "")}
                </span>
            </div>

            <div className="article-content-wrapper absolute inset-0 p-5 sm:p-6 flex flex-col justify-end items-center text-center z-10">
                <span className="article-tag bg-[#6042ef] text-white text-[10px] font-bold tracking-wider px-3 py-1 rounded-md mb-3 uppercase">
                    {category}
                </span>

                <h3 className="article-title text-white text-base sm:text-lg font-bold leading-snug mb-4 line-clamp-2 group-hover:text-gray-200 transition-colors">
                    {title}
                </h3>

                <div className="article-meta flex items-center justify-center gap-4 text-xs text-gray-400 w-full border-t border-white/10 pt-3">
                    <div className="author-info flex items-center gap-1.5">
                        <span className="meta-label">Posted by</span>

                        <Link
                            href=""
                            onClick={stopPropagation}
                            className="flex items-center gap-1.5"
                        >
                            <div className="author-avatar relative w-4 h-4 rounded-full overflow-hidden border border-white/20">
                                <Image
                                    src={author.image}
                                    alt={author.name}
                                    fill
                                    sizes="16px"
                                    className="object-cover"
                                />
                            </div>

                            <span className="author-name font-medium text-gray-300">
                                {author.name}
                            </span>
                        </Link>
                    </div>

                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                        }}
                        className="share-action-btn hover:text-white transition-colors"
                        aria-label="Share article"
                    >
                        <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M8.684 10.748a3.001 3.001 0 110 2.504l6.754 3.881a3 3 0 101.128-1.906l-6.754-3.882zm0 0a3 3 0 010-2.504l6.754-3.881a3 3 0 111.128 1.906l-6.754 3.882z"
                            />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}