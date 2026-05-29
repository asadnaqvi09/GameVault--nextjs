import React from 'react'

export default function SingleBlogPage({ params }) {
    const { slug } = params
    return (
        <div>This is single blog details page {slug}</div>
    )
}