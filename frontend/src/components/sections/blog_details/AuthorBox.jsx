import React from 'react';
import Image from 'next/image';

export default function AuthorBox({ author }) {
    return (
        <div id="author-profile-box" className="w-full max-w-4xl mx-auto px-4 mb-12 select-none">
            <div id="author-card-container" className="flex flex-col items-center text-center bg-[#f9f9f9] border border-gray-100 rounded-2xl p-8 md:p-10 shadow-xs">
                <div id="author-avatar-frame" className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-white shadow-sm mb-4">
                    <Image
                        src={author.image}
                        alt={author.name}
                        fill
                        sizes="80px"
                        className="object-cover"
                    />
                </div>
                <h4 id="author-box-name" className="text-base font-bold text-gray-900 mb-3 tracking-tight">
                    About {author.name}
                </h4>
                <p id="author-box-bio" className="text-gray-500 text-sm md:text-base leading-relaxed max-w-2xl">
                    {author.bio}
                </p>
            </div>
        </div>
    );
}