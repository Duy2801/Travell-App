const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const reviewValidation = require('../../validations/review.validation');
const reviewController = require('../../controllers/review.controller');

const router = express.Router();

router
  .route('/')
  .post(auth(), validate(reviewValidation.createReview), reviewController.createReview)
  .get(validate(reviewValidation.getReviews), reviewController.getReviews);

router
  .route('/my-reviews')
  .get(auth(), reviewController.getMyReviews);

router
  .route('/:targetType/:targetId')
  .get(validate(reviewValidation.getReviewsByTarget), reviewController.getReviewsByTarget);

router
  .route('/:reviewId')
  .get(validate(reviewValidation.getReview), reviewController.getReview)
  .patch(auth(), validate(reviewValidation.updateReview), reviewController.updateReview)
  .delete(auth(), validate(reviewValidation.deleteReview), reviewController.deleteReview);

module.exports = router;
