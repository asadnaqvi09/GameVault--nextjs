import React from 'react';
import Image from 'next/image';
import QuoteBlock from './QuoteBlock';

export default function BlogDetailsContent({ content }) {
    const processParagraphs = (text) => {
        if (!text) return null;
        return text.split('\n').map((paragraph, index) => (
            <p key={index} className="text-gray-600 text-base md:text-lg leading-relaxed mb-6">
                {paragraph}
            </p>
        ));
    };

    return (
        <article id="blog-body-container" className="w-full max-w-4xl mx-auto px-4 py-8 select-none">
            <div id="blog-primary-narrative" className="mb-8">
                {processParagraphs(content.desc1)}
            </div>

            {content.heading2 && (
                <h2 id="blog-secondary-heading" className="text-xl md:text-2xl font-bold text-gray-900 mt-10 mb-6 tracking-tight">
                    {content.heading2}
                </h2>
            )}

            {content.image2 && content.image3 && (
                <div id="blog-media-twin-grid" className="grid grid-cols-1 sm:grid-cols-2 gap-6 my-8">
                    <div className="media-frame-left relative aspect-[4/3] rounded-xl overflow-hidden shadow-sm">
                        <Image
                            src={content.image2}
                            alt="Contextual layout content overview"
                            fill
                            sizes="(max-width: 640px) 100vw, 50vw"
                            className="object-cover"
                        />
                    </div>
                    <div className="media-frame-right relative aspect-[4/3] rounded-xl overflow-hidden shadow-sm">
                        <Image
                            src={content.image3}
                            alt="Alternate contextual visualization"
                            fill
                            sizes="(max-width: 640px) 100vw, 50vw"
                            className="object-cover"
                        />
                    </div>
                </div>
            )}

            {content.heading3 && (
                <h3 id="blog-tertiary-heading" className="text-lg md:text-xl font-bold text-gray-900 mt-10 mb-4 tracking-tight">
                    {content.heading3}
                </h3>
            )}

            <QuoteBlock text={content.quote} />

            <div id="blog-secondary-narrative" className="mt-6">
                {processParagraphs(content.desc2)}
            </div>
        </article>
    );
}