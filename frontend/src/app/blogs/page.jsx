import React from 'react';
import Link from 'next/link';
import BlogCard from '@/components/shared/BlogCard';
import blogsData from '@/data/blogs.json';

export default function BlogPage() {
    return (
        <div id="blogs-page-root" className="w-full max-w-[1400px] mx-auto px-4 py-6 md:py-10 select-none">
            <nav id="blogs-breadcrumbs" className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-400 mb-6">
                <Link href="/" className="hover:text-gray-900 transition-colors">Home</Link>
                <span className="text-gray-300">/</span>
                <span className="text-gray-900">Blogs</span>
            </nav>

            <div id="blogs-header-wrapper" className="mb-10 pb-4 border-b border-gray-100">
                <h1 className="text-3xl font-black text-gray-900 tracking-tight uppercase">Blogs</h1>
            </div>

            <div id="blogs-responsive-grid" className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {blogsData.map((blog) => (
                    <BlogCard
                        key={blog.id}
                        id={blog.id}
                        title={blog.title}
                        category={blog.category}
                        date={blog.date}
                        bgImage={blog.bgImage}
                        author={blog.author}
                    />
                ))}
            </div>
        </div>
    );
}