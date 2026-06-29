"use client";
import React, { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar, faChevronDown } from '@fortawesome/free-solid-svg-icons'
import { useAuth } from '@/hooks/useAuth'
import { getGameReviews, createReview, updateReview } from '@/store/api/reviewApi'

const sortOptions = [
  { label: 'Default', value: 'default' },
  { label: 'Most Recent', value: 'most-recent' },
  { label: 'Highest Rating', value: 'highest-rating' },
  { label: 'Lowest Rating', value: 'lowest-rating' },
];

export default function ReviewsSection({ gameSlug = '', gameTitle = '' }) {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [reviewList, setReviewList] = useState([]);
  const [summary, setSummary] = useState({
    averageRating: 0,
    totalReviews: 0,
    distribution: [],
  });
  const [sortValue, setSortValue] = useState('default');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);
  const [existingReviewId, setExistingReviewId] = useState(null);

  const loadReviews = useCallback(async (sort = 'default') => {
    if (!gameSlug) return;
    setIsLoading(true);
    try {
      const response = await getGameReviews(gameSlug, { sort });
      setReviewList(response.data?.reviews || []);
      setSummary(response.data?.summary || {
        averageRating: 0,
        totalReviews: 0,
        distribution: [],
      });
      if (isAuthenticated && user?.userName) {
        const ownReview = (response.data?.reviews || []).find(
          (review) => review.username === user.userName
        );
        if (ownReview) {
          setExistingReviewId(ownReview.reviewId);
          setIsEditMode(true);
          setRating(ownReview.userRating);
          setReviewText(ownReview.comment);
        }
      }
    } catch {
      setReviewList([]);
      setSummary({ averageRating: 0, totalReviews: 0, distribution: [] });
    } finally {
      setIsLoading(false);
    }
  }, [gameSlug, isAuthenticated, user?.userName]);

  useEffect(() => {
    loadReviews(sortValue);
  }, [gameSlug, sortValue, loadReviews]);

  const handleSortChange = (event) => {
    setSortValue(event.target.value);
  };

  const handleReviewSubmit = async (event) => {
    event.preventDefault();
    setSubmitError('');
    if (!isAuthenticated) {
      router.push('/auth');
      return;
    }
    if (!rating || !reviewText.trim()) return;
    setIsSubmitting(true);
    try {
      const body = { rating, comment: reviewText.trim() };
      if (isEditMode && existingReviewId) {
        await updateReview(existingReviewId, body);
      } else {
        await createReview(gameSlug, body);
      }
      setRating(0);
      setReviewText('');
      setIsEditMode(false);
      setExistingReviewId(null);
      await loadReviews(sortValue);
    } catch (error) {
      if (error.response?.status === 409) {
        setSubmitError('You already reviewed this game. Update your review below.');
        setIsEditMode(true);
        const ownReview = reviewList.find((review) => review.username === user?.userName);
        if (ownReview) {
          setExistingReviewId(ownReview.reviewId);
          setRating(ownReview.userRating);
          setReviewText(ownReview.comment);
        }
      } else {
        setSubmitError(error.message || 'Failed to submit review.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const averageRating = summary.averageRating?.toFixed(1) ?? '0.0';
  const totalReviews = summary.totalReviews ?? 0;
  const ratingDistribution = summary.distribution?.length
    ? summary.distribution
    : [5, 4, 3, 2, 1].map((stars) => ({ stars, count: 0, percentage: 0 }));

  return (
    <div className="w-full max-w-[1400px] mx-auto px-4 py-10 border-t border-gray-100 select-none">
      <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight mb-8">Customer Reviews</h2>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-12">
        <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-12 gap-6 items-center bg-gray-50/50 p-6 sm:p-8 rounded-2xl border border-gray-100">
          <div className="sm:col-span-4 flex flex-col items-center justify-center text-center border-b sm:border-b-0 sm:border-r border-gray-200/60 pb-4 sm:pb-0 sm:pr-4">
            <span className="text-5xl font-black text-gray-900 leading-none">{averageRating}</span>
            <div className="flex items-center gap-0.5 mt-2.5 mb-1 text-amber-400 text-sm">
              {[...Array(5)].map((_, i) => (
                <FontAwesomeIcon key={i} icon={faStar} className={i < Math.round(summary.averageRating) ? "text-amber-400" : "text-gray-200"} />
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
        <form onSubmit={handleReviewSubmit} className="lg:col-span-6 flex flex-col gap-4">
          <h3 className="text-base font-black text-gray-900 tracking-tight">
            {isEditMode ? 'Edit your review' : 'Add a review'}
          </h3>
          {!isAuthenticated ? (
            <p className="text-sm font-medium text-gray-500">
              Please <button type="button" onClick={() => router.push('/auth')} className="text-[#6C47FF] font-bold hover:underline">log in</button> to leave a review.
            </p>
          ) : (
            <>
              <p className="text-xs font-medium text-gray-500 -mt-2">Required fields are marked <span className="text-red-500">*</span></p>
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
              {submitError ? (
                <p className="text-sm font-medium text-red-500">{submitError}</p>
              ) : null}
              <button
                type="submit"
                disabled={isSubmitting}
                className="h-11 bg-[#6C47FF] text-white text-xs font-bold rounded-xl shadow-md px-8 hover:bg-[#5b3ae6] transition-all self-start mt-2 disabled:opacity-60"
              >
                {isSubmitting ? 'Submitting...' : isEditMode ? 'Update Review' : 'Submit'}
              </button>
            </>
          )}
        </form>
      </div>
      <div className="w-full border-t border-gray-100 pt-8 flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <span className="text-sm font-black text-gray-900">{totalReviews} reviews for {gameTitle}</span>
          <div className="relative">
            <select
              value={sortValue}
              onChange={handleSortChange}
              className="bg-white border border-gray-200 rounded-lg pl-3 pr-8 py-1.5 text-xs font-bold text-gray-600 outline-none appearance-none cursor-pointer focus:border-[#6C47FF]"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
            <FontAwesomeIcon icon={faChevronDown} className="absolute inset-y-0 right-3 my-auto text-[10px] text-gray-400 pointer-events-none" />
          </div>
        </div>
        {isLoading ? (
          <div className="text-center py-8 text-gray-500 font-medium">Loading reviews...</div>
        ) : (
          <div className="flex flex-col gap-4">
            {reviewList.map((rev) => (
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
        )}
      </div>
    </div>
  )
}
