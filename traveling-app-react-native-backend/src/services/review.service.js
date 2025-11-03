const httpStatus = require('http-status');
const { Review } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a review
 * @param {ObjectId} userId
 * @param {Object} reviewBody
 * @returns {Promise<Review>}
 */
const createReview = async (userId, reviewBody) => {
  const review = await Review.create({
    ...reviewBody,
    userId,
  });
  return review.populate('userId');
};

/**
 * Query for reviews
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryReviews = async (filter, options) => {
  const reviews = await Review.paginate(filter, {
    ...options,
    populate: 'userId',
  });
  return reviews;
};

/**
 * Get review by id
 * @param {ObjectId} id
 * @returns {Promise<Review>}
 */
const getReviewById = async (id) => {
  return Review.findById(id).populate('userId');
};

/**
 * Update review by id
 * @param {ObjectId} reviewId
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @returns {Promise<Review>}
 */
const updateReviewById = async (reviewId, userId, updateBody) => {
  const review = await getReviewById(reviewId);
  if (!review) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Review not found');
  }
  if (review.userId.toString() !== userId.toString()) {
    throw new ApiError(httpStatus.FORBIDDEN, 'You can only update your own reviews');
  }
  Object.assign(review, updateBody);
  await review.save();
  return review;
};

/**
 * Delete review by id
 * @param {ObjectId} reviewId
 * @param {ObjectId} userId
 * @returns {Promise<Review>}
 */
const deleteReviewById = async (reviewId, userId) => {
  const review = await getReviewById(reviewId);
  if (!review) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Review not found');
  }
  if (review.userId.toString() !== userId.toString()) {
    throw new ApiError(httpStatus.FORBIDDEN, 'You can only delete your own reviews');
  }
  await review.remove();
  return review;
};

/**
 * Get reviews by target (tour or hotel)
 * @param {string} targetType - 'tour' or 'hotel'
 * @param {ObjectId} targetId
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
const getReviewsByTarget = async (targetType, targetId, options) => {
  const filter = {
    targetType,
    targetId,
  };
  return queryReviews(filter, options);
};

module.exports = {
  createReview,
  queryReviews,
  getReviewById,
  updateReviewById,
  deleteReviewById,
  getReviewsByTarget,
};
