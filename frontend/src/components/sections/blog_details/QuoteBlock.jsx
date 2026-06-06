import React from 'react';

export default function QuoteBlock({ text }) {
    if (!text) return null;

    return (
        <blockquote id="blog-editorial-quote" className="pl-6 border-l-4 border-[#6042ef] my-8 select-none">
            <p className="text-gray-700 italic text-base md:text-lg font-medium leading-relaxed">
                {text}
            </p>
        </blockquote>
    );
}