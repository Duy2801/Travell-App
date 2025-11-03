const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createReview = {
  body: Joi.object().keys({
    targetType: Joi.string().required().valid('tour', 'hotel'),
    targetId: Joi.string().required().custom(objectId),
    rating: Joi.number().required().min(1).max(5),
    comment: Joi.string(),
  }),
};

const getReviews = {
  query: Joi.object().keys({
    userId: Joi.string().custom(objectId),
    targetType: Joi.string().valid('tour', 'hotel'),
    targetId: Joi.string().custom(objectId),
    rating: Joi.number().min(1).max(5),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getReview = {
  params: Joi.object().keys({
    reviewId: Joi.string().custom(objectId),
  }),
};

const updateReview = {
  params: Joi.object().keys({
    reviewId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      rating: Joi.number().min(1).max(5),
      comment: Joi.string(),
    })
    .min(1),
};

const deleteReview = {
  params: Joi.object().keys({
    reviewId: Joi.string().custom(objectId),
  }),
};

const getReviewsByTarget = {
  params: Joi.object().keys({
    targetType: Joi.string().required().valid('tour', 'hotel'),
    targetId: Joi.string().required().custom(objectId),
  }),
  query: Joi.object().keys({
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

module.exports = {
  createReview,
  getReviews,
  getReview,
  updateReview,
  deleteReview,
  getReviewsByTarget,
};
