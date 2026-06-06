import React from 'react';
import Image from 'next/image';

export default function BlogDetailsHeader({ category, title, author, date, bgImage }) {
    return (
        <div className="blog-header-wrapper flex flex-col items-center w-full max-w-5xl mx-auto pt-8 pb-6">
            <span className="blog-category-badge bg-[#6042ef] text-white text-[10px] font-bold tracking-wider px-3 py-1 rounded-md mb-5 uppercase">
                {category}
            </span>
            <h1 className="blog-main-title text-3xl sm:text-4xl lg:text-5xl font-bold text-[#111111] text-center leading-snug mb-5">
                {title}
            </h1>
            <div className="blog-meta-info flex items-center justify-center gap-2 text-sm text-gray-500 mb-8">
                <span className="meta-prefix">Posted by</span>
                <div className="author-avatar-wrapper relative w-6 h-6 rounded-full overflow-hidden border border-gray-200">
                    <Image
                        src={author.image}
                        alt={author.name}
                        fill
                        className="object-cover"
                    />
                </div>
                <span className="author-name-text font-medium text-gray-900">{author.name}</span>
                <span className="meta-separator text-gray-400">On</span>
                <span className="meta-date">{date}</span>
            </div>
            <div className="blog-hero-image-container relative w-full aspect-[16/9] rounded-xl overflow-hidden shadow-sm">
                <Image
                    src={bgImage}
                    alt={title}
                    fill
                    className="object-cover"
                    priority
                />
            </div>
        </div>
    );
}