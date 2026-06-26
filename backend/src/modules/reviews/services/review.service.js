import mongoose from 'mongoose';
import Review from '../models/review.model.js';
import Game from '../../games/models/game.model.js';
import { PUBLIC_FILTER } from '../../games/services/game.service.js';

export const PUBLIC_REVIEW_FILTER = { isApproved: true, isDeleted: false };

const toObjectId = (id) =>
  id instanceof mongoose.Types.ObjectId ? id : new mongoose.Types.ObjectId(id);

export const formatReviewDate = (date) =>
  date ? new Date(date).toISOString().split('T')[0] : null;

export const toPublicReviewShape = (review) => ({
  reviewId: review._id.toString(),
  username: review.user?.userName ?? 'Anonymous',
  userRating: review.rating,
  comment: review.comment,
  date: formatReviewDate(review.createdAt)
});

export const buildReviewSort = (sort) => {
  switch (sort) {
    case 'highest-rating':
      return { rating: -1, createdAt: -1 };
    case 'lowest-rating':
      return { rating: 1, createdAt: -1 };
    case 'most-recent':
    case 'default':
    default:
      return { createdAt: -1 };
  }
};

export const resolveGameBySlug = async (slug, { reviewableOnly = false } = {}) => {
  const filter = reviewableOnly
    ? PUBLIC_FILTER
    : { isDeleted: false };

  return Game.findOne({ id: slug.toLowerCase(), ...filter })
    .select('_id id title rating reviewCount')
    .lean();
};

export const buildReviewSummary = async (gameId) => {
  const match = { game: toObjectId(gameId), ...PUBLIC_REVIEW_FILTER };

  const [stats, buckets] = await Promise.all([
    Review.aggregate([
      { $match: match },
      {
        $group: {
          _id: null,
          averageRating: { $avg: '$rating' },
          totalReviews: { $sum: 1 }
        }
      }
    ]),
    Review.aggregate([
      { $match: match },
      { $group: { _id: '$rating', count: { $sum: 1 } } }
    ])
  ]);

  const totalReviews = stats[0]?.totalReviews ?? 0;
  const averageRating = stats[0]?.averageRating ?? 0;
  const countByStar = Object.fromEntries(buckets.map((b) => [b._id, b.count]));

  const distribution = [5, 4, 3, 2, 1].map((stars) => {
    const count = countByStar[stars] ?? 0;
    const percentage = totalReviews > 0
      ? Math.round((count / totalReviews) * 1000) / 10
      : 0;
    return { stars, count, percentage };
  });

  return {
    averageRating: Math.round(averageRating * 10) / 10,
    totalReviews,
    distribution
  };
};

export const recalculateGameRating = async (gameId) => {
  const match = { game: toObjectId(gameId), ...PUBLIC_REVIEW_FILTER };

  const [result] = await Review.aggregate([
    { $match: match },
    {
      $group: {
        _id: null,
        avgRating: { $avg: '$rating' },
        count: { $sum: 1 }
      }
    }
  ]);

  const rating = result ? Math.round(result.avgRating * 10) / 10 : 0;
  const reviewCount = result?.count ?? 0;

  await Game.findByIdAndUpdate(gameId, { rating, reviewCount });
  return { rating, reviewCount };
};

export const paginateGameReviews = async (gameId, { page, limit, sort }) => {
  const filter = { game: toObjectId(gameId), ...PUBLIC_REVIEW_FILTER };
  const skip = (page - 1) * limit;
  const sortOptions = buildReviewSort(sort);

  const [reviews, total] = await Promise.all([
    Review.find(filter)
      .populate('user', 'userName')
      .sort(sortOptions)
      .skip(skip)
      .limit(limit)
      .lean(),
    Review.countDocuments(filter)
  ]);

  return {
    reviews: reviews.map(toPublicReviewShape),
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit) || 0
  };
};

export const isValidReviewId = (id) => mongoose.Types.ObjectId.isValid(id);