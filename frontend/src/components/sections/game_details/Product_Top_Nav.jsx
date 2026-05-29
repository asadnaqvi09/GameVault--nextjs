import React from 'react'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft, faChevronRight, faTh } from '@fortawesome/free-solid-svg-icons'

export default function ProductTopNav({ genre, title, prevGameId, nextGameId }) {
    return (
        <nav className="w-full max-w-[1400px] mx-auto px-4 py-4 flex items-center justify-between bg-white select-none">
            <div className="flex items-center gap-2 text-sm font-medium">
                <Link href="/" className="text-gray-500 hover:text-gray-900 transition-colors">Home</Link>
                <span className="text-gray-300">/</span>
                <Link href={`/games?genre=${genre?.toLowerCase()}`} className="text-gray-500 hover:text-gray-900 transition-colors capitalize">{genre}</Link>
                <span className="text-gray-300">/</span>
                <span className="text-gray-900 font-bold">{title}</span>
            </div>
            <div className="flex items-center gap-2">
                {prevGameId ? (
                    <Link href={`/games/${prevGameId}`} className="text-gray-400 hover:text-gray-900 transition-colors p-1">
                        <FontAwesomeIcon icon={faChevronLeft} className="text-xs" />
                    </Link>
                ) : (
                    <div className="text-gray-300 cursor-not-allowed p-1">
                        <FontAwesomeIcon icon={faChevronLeft} className="text-xs" />
                    </div>
                )}

                <Link href="/games" className="text-gray-400 hover:text-gray-900 transition-colors p-1">
                    <FontAwesomeIcon icon={faTh} className="text-sm" />
                </Link>

                {nextGameId ? (
                    <Link href={`/games/${nextGameId}`} className="text-gray-400 hover:text-gray-900 transition-colors p-1">
                        <FontAwesomeIcon icon={faChevronRight} className="text-xs" />
                    </Link>
                ) : (
                    <div className="text-gray-300 cursor-not-allowed p-1">
                        <FontAwesomeIcon icon={faChevronRight} className="text-xs" />
                    </div>
                )}
            </div>
        </nav>
    )
}