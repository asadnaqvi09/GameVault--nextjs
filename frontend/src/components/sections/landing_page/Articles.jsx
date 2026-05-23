import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import article1 from "../../../../public/images/article1.jpg"
import article2 from "../../../../public/images/article2.jpg";
import article3 from "../../../../public/images/article3.jpg";
import avatar1 from "../../../../public/images/author.jpg";

const articlesData = [
  {
    id: 'fabledom-freebies',
    title: 'Upcoming freebies: Fabledom. Tales of trades, feuds and partnerships',
    tag: 'FREEBIES',
    date: '28',
    month: 'JUN',
    author: 'Mr. Mackay',
    authorAvatar: avatar1,
    commentCount: 1,
    image: article1,
  },
  {
    id: 'diablo-4-patch',
    title: 'Diablo 4 Patch 1.03 Fixes Nightmare Dungeons and the Endgame XP Grind',
    tag: 'BLOG',
    date: '14',
    month: 'JUN',
    author: 'Mr. Mackay',
    authorAvatar: avatar1,
    commentCount: 0,
    image: article2,
  },
  {
    id: 'survivor-boss-bizarre',
    title: "Survivor's Most Bizarre and Beloved Boss Came to Be",
    tag: 'BUNDLES',
    date: '31',
    month: 'MAY',
    author: 'Mr. Mackay',
    authorAvatar: avatar1,
    commentCount: 1,
    image: article3,
  },
];

function LatestArticles() {
  return (
    <section className="w-full max-w-7xl mx-auto px-4 py-12 bg-white">
      <div className="section-header flex items-center justify-between mb-8">
        <h2 className="section-title text-2xl sm:text-3xl font-bold text-[#111111]">
          Our Latest Articles
        </h2>
        <Link href="/blog" passHref legacyBehavior>
          <a className="more-articles-btn flex items-center gap-2 bg-[#f4f4f5] hover:bg-[#e4e4e7] text-[#111111] font-semibold px-5 py-2.5 rounded-full text-sm transition-colors duration-200">
            More Articles
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </Link>
      </div>
      <div className="articles-grid grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {articlesData.map((article) => (
          <Link key={article.id} href={`/blog/${article.id}`} passHref legacyBehavior>
            <a className="article-card group relative block w-full aspect-[4/3] rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
              <Image
                src={article.image}
                alt={article.title}
                layout="fill"
                objectFit="cover"
                className="article-bg-image transition-transform duration-500 group-hover:scale-105"
              />
              <div className="article-overlay absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-black/20" />
              <div className="article-date-badge absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-2 flex flex-col items-center justify-center min-w-[48px] text-center shadow-sm">
                <span className="date-number text-xl font-bold text-[#111111] leading-none">
                  {article.date}
                </span>
                <span className="date-month text-[10px] font-bold text-gray-500 tracking-wider mt-0.5">
                  {article.month}
                </span>
              </div>
              <div className="article-content-wrapper absolute inset-0 p-5 sm:p-6 flex flex-col justify-end items-center text-center z-10">
                <span className="article-tag bg-[#6042ef] text-white text-[10px] font-bold tracking-wider px-3 py-1 rounded-md mb-3 uppercase">
                  {article.tag}
                </span>
                <h3 className="article-title text-white text-base sm:text-lg font-bold leading-snug mb-4 line-clamp-3 group-hover:text-gray-200 transition-colors">
                  {article.title}
                </h3>
                <div className="article-meta flex items-center justify-center gap-4 text-xs text-gray-400 w-full border-t border-white/10 pt-3">
                  <div className="author-info flex items-center gap-1.5">
                    <span className="meta-label">Posted by</span>
                    <div className="author-avatar relative w-4 h-4 rounded-full overflow-hidden border border-white/20">
                      <Image
                        src={article.authorAvatar}
                        alt={article.author}
                        layout="fill"
                        objectFit="cover"
                      />
                    </div>
                    <span className="author-name font-medium text-gray-300">{article.author}</span>
                  </div>
                  <button className="share-action-btn hover:text-white transition-colors" onClick={(e) => e.preventDefault()}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 10.748a3.001 3.001 0 110 2.504l6.754 3.881a3 3 0 101.128-1.906l-6.754-3.882zm0 0a3 3 0 010-2.504l6.754-3.881a3 3 0 111.128 1.906l-6.754 3.882z" />
                    </svg>
                  </button>
                  <div className="comments-info flex items-center gap-1">
                    <div className="relative flex items-center justify-center">
                      <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
                      </svg>
                      <span className="comment-badge-count absolute text-[9px] font-bold text-white top-[-2px] leading-none">
                        {article.commentCount}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </a>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default LatestArticles;