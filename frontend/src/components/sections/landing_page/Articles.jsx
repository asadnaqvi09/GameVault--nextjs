import React from 'react';
import Link from 'next/link';
import BlogCard from '@/components/shared/BlogCard';
import articleImageOne from "../../../../public/images/article1.jpg";
import articleImageTwo from "../../../../public/images/article2.jpg";
import articleImageThree from "../../../../public/images/article3.jpg";
import globalAuthorAvatar from "../../../../public/images/author.jpg";

const structuralArticlesDataset = [
  {
    id: 'fabledom-freebies',
    title: 'Upcoming freebies: Fabledom. Tales of trades, feuds and partnerships',
    category: 'FREEBIES',
    date: '28 JUN',
    bgImage: articleImageOne,
    author: {
      name: 'Mr. Mackay',
      image: globalAuthorAvatar
    }
  },
  {
    id: 'diablo-4-patch',
    title: 'Diablo 4 Patch 1.03 Fixes Nightmare Dungeons and the Endgame XP Grind',
    category: 'BLOG',
    date: '14 JUN',
    bgImage: articleImageTwo,
    author: {
      name: 'Mr. Mackay',
      image: globalAuthorAvatar
    }
  },
  {
    id: 'survivor-boss-bizarre',
    title: "Survivor's Most Bizarre and Beloved Boss Came to Be",
    category: 'BUNDLES',
    date: '31 MAY',
    bgImage: articleImageThree,
    author: {
      name: 'Mr. Mackay',
      image: globalAuthorAvatar
    }
  }
];

export default function LatestArticles() {
  return (
    <section id="latest-articles-section" className="w-full max-w-7xl mx-auto px-4 py-12 bg-white selection:bg-[#6042ef]/10">
      <div id="articles-section-header" className="flex items-center justify-between mb-8">
        <h2 className="text-2xl sm:text-3xl font-black text-[#111111] tracking-tight">Our Latest Articles</h2>
        <Link href="/blogs" className="flex items-center gap-2 bg-[#f4f4f5] hover:bg-[#e4e4e7] text-[#111111] font-bold px-5 py-2.5 rounded-full text-sm transition-colors duration-200">
          <span>More Articles</span>
          <svg className="w-4 h-4 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
      <div id="articles-responsive-grid" className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {structuralArticlesDataset.map((article) => (
          <BlogCard
            key={article.id}
            id={article.id}
            title={article.title}
            category={article.category}
            date={article.date}
            bgImage={article.bgImage}
            author={article.author}
          />
        ))}
      </div>
    </section>
  );
}