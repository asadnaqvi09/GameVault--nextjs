import React from 'react';
import { notFound } from 'next/navigation';
import BlogDetailsHeader from '@/components/sections/blog_details/Blog_Details_Header';
import BlogDetailsContent from '@/components/sections/blog_details/Blog_Details_Content';
import AuthorBox from '@/components/sections/blog_details/AuthorBox';
import blogsDetailsData from '@/data/blogs.json';

export default async function BlogDetailsParentPage({ params }) {
    const { slug } = await params;
    const currentBlogPost = blogsDetailsData.find((blog) => blog.id === slug);
    if (!currentBlogPost) {
        notFound();
    }
    return (
        <div id="dynamic-blog-details-parent" className="w-full bg-white selection:bg-[#6042ef]/10">
            <div id="blog-content-layout-wrapper" className="w-full max-w-7xl mx-auto px-4 md:px-6">
                <BlogDetailsHeader
                    category={currentBlogPost.category}
                    title={currentBlogPost.title}
                    author={currentBlogPost.author}
                    date={currentBlogPost.date}
                    bgImage={currentBlogPost.bgImage}
                />
                <BlogDetailsContent
                    content={currentBlogPost.content}
                />
                <AuthorBox
                    author={currentBlogPost.author}
                />
            </div>
        </div>
    );
}

export function generateStaticParams() {
    return blogsDetailsData.map((blog) => ({
        slug: blog.id,
    }));
}