"use client";
import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar, faChevronDown } from '@fortawesome/free-solid-svg-icons'

export default function ReviewsSection({ reviews = [], gameTitle = "" }) {
    const [rating, setRating] = useState(0)
    const [hoverRating, setHoverRating] = useState(0)
    const [reviewText, setReviewText] = useState('')
    const [reviewerName, setReviewerName] = useState('')
    const [reviewerEmail, setReviewerEmail] = useState('')
    const [saveDetails, setSaveDetails] = useState(false)
    const totalReviews = reviews.length
    const averageRating = totalReviews > 0 ? (reviews.reduce((acc, curr) => acc + curr.userRating, 0) / totalReviews).toFixed(1) : "0.0"
    const ratingDistribution = [5, 4, 3, 2, 1].map(stars => {
        const count = reviews.filter(r => r.userRating === stars).length
        const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0
        return { stars, count, percentage }
    })
    const handleSubmit = (e) => {
        e.preventDefault()
        setReviewText('')
        setReviewerName('')
        setReviewerEmail('')
        setRating(0)
    }
    return (
        <div className="w-full max-w-[1400px] mx-auto px-4 py-10 border-t border-gray-100 select-none">
            <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight mb-8">Customer Reviews</h2>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-12">
                <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-12 gap-6 items-center bg-gray-50/50 p-6 sm:p-8 rounded-2xl border border-gray-100">
                    <div className="sm:col-span-4 flex flex-col items-center justify-center text-center border-b sm:border-b-0 sm:border-r border-gray-200/60 pb-4 sm:pb-0 sm:pr-4">
                        <span className="text-5xl font-black text-gray-900 leading-none">{averageRating}</span>
                        <div className="flex items-center gap-0.5 mt-2.5 mb-1 text-amber-400 text-sm">
                            {[...Array(5)].map((_, i) => (
                                <FontAwesomeIcon key={i} icon={faStar} className={i < Math.round(averageRating) ? "text-amber-400" : "text-gray-200"} />
                            ))}
                        </div>
                        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{totalReviews} reviews</span>
                    </div>
                    <div className="sm:col-span-8 flex flex-col gap-2.5 w-full">
                        {ratingDistribution.map((row) => (
                            <div key={row.stars} className="flex items-center gap-3 text-xs font-bold text-gray-600">
                                <div className="flex items-center gap-0.5 w-11 shrink-0 text-amber-400">
                                    {[...Array(5)].map((_, i) => (
                                        <FontAwesomeIcon key={i} icon={faStar} className={i < row.stars ? "text-amber-400" : "text-gray-200"} />
                                    ))}
                                </div>
                                <div className="flex-1 h-2 bg-gray-200/70 rounded-full overflow-hidden relative">
                                    <div className="absolute inset-y-0 left-0 bg-[#6C47FF] transition-all duration-500 rounded-full" style={{ width: `${row.percentage}%` }} />
                                </div>
                                <span className="w-4 text-right text-gray-400 font-medium">{row.count}</span>
                            </div>
                        ))}
                    </div>
                </div>
                <form onSubmit={handleSubmit} className="lg:col-span-6 flex flex-col gap-4">
                    <h3 className="text-base font-black text-gray-900 tracking-tight">Add a review</h3>
                    <p className="text-xs font-medium text-gray-500 -mt-2">Your email address will not be published. Required fields are marked <span className="text-red-500">*</span></p>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">Your rating * :</span>
                        <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    type="button"
                                    key={star}
                                    onClick={() => setRating(star)}
                                    onMouseEnter={() => setHoverRating(star)}
                                    onMouseLeave={() => setHoverRating(0)}
                                    className="text-sm transition-colors focus:outline-none"
                                >
                                    <FontAwesomeIcon icon={faStar} className={(hoverRating || rating) >= star ? "text-amber-400" : "text-gray-200"} />
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Your review *</label>
                        <textarea
                            required
                            rows={5}
                            value={reviewText}
                            onChange={(e) => setReviewText(e.target.value)}
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium text-gray-700 outline-none focus:border-[#6C47FF] focus:bg-white resize-none transition-all"
                        />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Name *</label>
                            <input
                                type="text"
                                required
                                value={reviewerName}
                                onChange={(e) => setReviewerName(e.target.value)}
                                className="w-full h-11 bg-gray-50 border border-gray-200 rounded-xl px-4 text-sm font-medium text-gray-700 outline-none focus:border-[#6C47FF] focus:bg-white transition-all"
                            />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Email *</label>
                            <input
                                type="email"
                                required
                                value={reviewerEmail}
                                onChange={(e) => setReviewerEmail(e.target.value)}
                                className="w-full h-11 bg-gray-50 border border-gray-200 rounded-xl px-4 text-sm font-medium text-gray-700 outline-none focus:border-[#6C47FF] focus:bg-white transition-all"
                            />
                        </div>
                    </div>
                    <label className="flex items-start gap-2.5 cursor-pointer mt-1">
                        <input
                            type="checkbox"
                            checked={saveDetails}
                            onChange={(e) => setSaveDetails(e.target.checked)}
                            className="mt-0.5 rounded border-gray-300 text-[#6C47FF] focus:ring-[#6C47FF] w-4 h-4"
                        />
                        <span className="text-xs font-semibold text-gray-500 leading-snug">Save my name, email, and website in this browser for the next time I comment.</span>
                    </label>
                    <button type="submit" className="h-11 bg-[#6C47FF] text-white text-xs font-bold rounded-xl shadow-md px-8 hover:bg-[#5b3ae6] transition-all self-start mt-2">
                        Submit
                    </button>
                </form>
            </div>
            <div className="w-full border-t border-gray-100 pt-8 flex flex-col gap-6">
                <div className="flex items-center justify-between">
                    <span className="text-sm font-black text-gray-900">{totalReviews} reviews for {gameTitle}</span>
                    <div className="relative">
                        <select className="bg-white border border-gray-200 rounded-lg pl-3 pr-8 py-1.5 text-xs font-bold text-gray-600 outline-none appearance-none cursor-pointer focus:border-[#6C47FF]">
                            <option>Default</option>
                            <option>Most Recent</option>
                            <option>Highest Rating</option>
                            <option>Lowest Rating</option>
                        </select>
                        <FontAwesomeIcon icon={faChevronDown} className="absolute inset-y-0 right-3 my-auto text-[10px] text-gray-400 pointer-events-none" />
                    </div>
                </div>
                <div className="flex flex-col gap-4">
                    {reviews.map((rev) => (
                        <div key={rev.reviewId} className="w-full bg-white border border-gray-100 rounded-xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.01)] flex flex-col gap-2.5 text-left">
                            <div className="flex items-center justify-between flex-wrap gap-2">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-black text-gray-800">{rev.username}</span>
                                    <div className="flex items-center gap-0.5 text-amber-400 text-[10px]">
                                        {[...Array(5)].map((_, i) => (
                                            <FontAwesomeIcon key={i} icon={faStar} className={i < rev.userRating ? "text-amber-400" : "text-gray-200"} />
                                        ))}
                                    </div>
                                </div>
                                <span className="text-xs font-bold text-gray-400">{rev.date}</span>
                            </div>
                            <p className="text-xs sm:text-sm text-gray-500 font-medium leading-relaxed">
                                {rev.comment}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}