import React from 'react'

export default async function AuthorPage({ params }) {
    const { id } = await params
    return (
        <div>This is single author details page {id}</div>
    )
}