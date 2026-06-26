import Review from '../models/review.model.js';
import {
  createReviewValidator,
  updateReviewValidator,
  listQueryValidator,
  moderationValidator
} from '../validators/review.validator.js';
import {
  resolveGameBySlug,
  buildReviewSummary,
  paginateGameReviews,
  recalculateGameRating,
  toPublicReviewShape,
  isValidReviewId
} from '../services/review.service.js';

const joiError = (res, error) =>
  res.status(400).json({
    success: false,
    message: error.details.map((e) => e.message).join(', ')
  });

const isOwnerOrAdmin = (review, user) =>
  review.user.toString() === user._id.toString() || user.role === 'Admin';

const findActiveReview = async (reviewId) => {
  if (!isValidReviewId(reviewId)) return null;
  return Review.findOne({ _id: reviewId, isDeleted: false }).lean();
};

export const getGameReviews = async (req, res) => {
  try {
    const { error, value } = listQueryValidator(req.query);
    if (error) return joiError(res, error);
    const game = await resolveGameBySlug(req.params.slug);
    if (!game) {
      return res.status(404).json({ success: false, message: 'Game Not Found' });
    }
    const [summary, result] = await Promise.all([
      buildReviewSummary(game._id),
      paginateGameReviews(game._id, value)
    ]);
    return res.status(200).json({
      success: true,
      message: 'Reviews fetched successfully',
      data: { summary, reviews: result.reviews },
      meta: {
        page: result.page,
        limit: result.limit,
        total: result.total,
        totalPages: result.totalPages
      }
    });
  } catch (error) {
    console.log('Error in Get Game Reviews Controller : ', error.message);
    return res.status(500).json({
      success: false,
      message: 'Error in Get Game Reviews Controller',
      error: error.message
    });
  }
};

export const getGameReviewSummary = async (req, res) => {
  try {
    const game = await resolveGameBySlug(req.params.slug);
    if (!game) {
      return res.status(404).json({ success: false, message: 'Game Not Found' });
    }
    const summary = await buildReviewSummary(game._id);
    return res.status(200).json({
      success: true,
      message: 'Review summary fetched successfully',
      data: summary
    });
  } catch (error) {
    console.log('Error in Get Game Review Summary Controller : ', error.message);
    return res.status(500).json({
      success: false,
      message: 'Error in Get Game Review Summary Controller',
      error: error.message
    });
  }
};

export const createReview = async (req, res) => {
  try {
    const { error, value } = createReviewValidator(req.body);
    if (error) return joiError(res, error);
    const game = await resolveGameBySlug(req.params.slug, { reviewableOnly: true });
    if (!game) {
      return res.status(404).json({ success: false, message: 'Game Not Found' });
    }
    const existing = await Review.findOne({
      user: req.user._id,
      game: game._id,
      isDeleted: false
    }).select('_id').lean();
    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'You have already reviewed this game'
      });
    }
    const review = await Review.create({
      user: req.user._id,
      game: game._id,
      rating: value.rating,
      comment: value.comment
    });
    const gameSummary = await recalculateGameRating(game._id);
    const populated = await Review.findById(review._id)
      .populate('user', 'userName')
      .lean();
    return res.status(201).json({
      success: true,
      message: 'Review created successfully',
      data: {
        review: toPublicReviewShape(populated),
        gameSummary
      }
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'You have already reviewed this game'
      });
    }
    console.log('Error in Create Review Controller : ', error.message);
    return res.status(500).json({
      success: false,
      message: 'Error in Create Review Controller',
      error: error.message
    });
  }
};

export const updateReview = async (req, res) => {
  try {
    const { error, value } = updateReviewValidator(req.body);
    if (error) return joiError(res, error);
    const review = await findActiveReview(req.params.reviewId);
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review Not Found' });
    }
    if (!isOwnerOrAdmin(review, req.user)) {
      return res.status(403).json({ success: false, message: 'Forbidden: Access denied' });
    }
    const updated = await Review.findByIdAndUpdate(
      review._id,
      value,
      { new: true, runValidators: true }
    )
      .populate('user', 'userName')
      .lean();
    const gameSummary = await recalculateGameRating(review.game);
    return res.status(200).json({
      success: true,
      message: 'Review updated successfully',
      data: {
        review: toPublicReviewShape(updated),
        gameSummary
      }
    });
  } catch (error) {
    console.log('Error in Update Review Controller : ', error.message);
    return res.status(500).json({
      success: false,
      message: 'Error in Update Review Controller',
      error: error.message
    });
  }
};

export const deleteReview = async (req, res) => {
  try {
    const review = await findActiveReview(req.params.reviewId);
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review Not Found' });
    }
    if (!isOwnerOrAdmin(review, req.user)) {
      return res.status(403).json({ success: false, message: 'Forbidden: Access denied' });
    }
    await Review.findByIdAndUpdate(review._id, { isDeleted: true });
    const gameSummary = await recalculateGameRating(review.game);
    return res.status(200).json({
      success: true,
      message: 'Review deleted successfully',
      data: { gameSummary }
    });
  } catch (error) {
    console.log('Error in Delete Review Controller : ', error.message);
    return res.status(500).json({
      success: false,
      message: 'Error in Delete Review Controller',
      error: error.message
    });
  }
};

export const hardDeleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.reviewId).select('game').lean();
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review Not Found' });
    }
    await Review.findByIdAndDelete(review._id);
    const gameSummary = await recalculateGameRating(review.game);
    return res.status(200).json({
      success: true,
      message: 'Review permanently deleted',
      data: { gameSummary }
    });
  } catch (error) {
    console.log('Error in Hard Delete Review Controller : ', error.message);
    return res.status(500).json({
      success: false,
      message: 'Error in Hard Delete Review Controller',
      error: error.message
    });
  }
};

export const moderateReview = async (req, res) => {
  try {
    const { error, value } = moderationValidator(req.body);
    if (error) return joiError(res, error);
    const review = await findActiveReview(req.params.reviewId);
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review Not Found' });
    }
    const updated = await Review.findByIdAndUpdate(
      review._id,
      { isApproved: value.isApproved },
      { new: true }
    )
      .populate('user', 'userName')
      .lean();
    const gameSummary = await recalculateGameRating(review.game);
    return res.status(200).json({
      success: true,
      message: 'Review moderation updated successfully',
      data: {
        review: toPublicReviewShape(updated),
        gameSummary
      }
    });
  } catch (error) {
    console.log('Error in Moderate Review Controller : ', error.message);
    return res.status(500).json({
      success: false,
      message: 'Error in Moderate Review Controller',
      error: error.message
    });
  }
};

export const getMyReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ user: req.user._id, isDeleted: false })
      .populate('user', 'userName')
      .populate('game', 'id title coverImage')
      .sort({ createdAt: -1 })
      .lean();
    return res.status(200).json({
      success: true,
      message: 'Your reviews fetched successfully',
      data: reviews.map((review) => ({
        ...toPublicReviewShape(review),
        game: {
          slug: review.game?.id ?? null,
          title: review.game?.title ?? null,
          coverImage: review.game?.coverImage ?? null
        }
      }))
    });
  } catch (error) {
    console.log('Error in Get My Reviews Controller : ', error.message);
    return res.status(500).json({
      success: false,
      message: 'Error in Get My Reviews Controller',
      error: error.message
    });
  }
};
