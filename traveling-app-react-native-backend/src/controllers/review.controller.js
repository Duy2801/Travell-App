const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { reviewService } = require('../services');

const createReview = catchAsync(async (req, res) => {
  const review = await reviewService.createReview(req.user.id, req.body);
  res.status(httpStatus.CREATED).send(review);
});

const getReviews = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['userId', 'targetType', 'targetId', 'rating']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await reviewService.queryReviews(filter, options);
  res.send(result);
});

const getReview = catchAsync(async (req, res) => {
  const review = await reviewService.getReviewById(req.params.reviewId);
  if (!review) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Review not found');
  }
  res.send(review);
});

const updateReview = catchAsync(async (req, res) => {
  const review = await reviewService.updateReviewById(req.params.reviewId, req.user.id, req.body);
  res.send(review);
});

const deleteReview = catchAsync(async (req, res) => {
  await reviewService.deleteReviewById(req.params.reviewId, req.user.id);
  res.status(httpStatus.NO_CONTENT).send();
});

const getReviewsByTarget = catchAsync(async (req, res) => {
  const { targetType, targetId } = req.params;
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await reviewService.getReviewsByTarget(targetType, targetId, options);
  res.send(result);
});

const getMyReviews = catchAsync(async (req, res) => {
  const filter = { userId: req.user.id };
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await reviewService.queryReviews(filter, options);
  res.send(result);
});

module.exports = {
  createReview,
  getReviews,
  getReview,
  updateReview,
  deleteReview,
  getReviewsByTarget,
  getMyReviews,
};
