const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createNotification = {
  body: Joi.object().keys({
    userId: Joi.string().custom(objectId).required(),
    type: Joi.string().valid('booking', 'system', 'service', 'promotion', 'reminder').required(),
    title: Joi.string().required(),
    message: Joi.string().required(),
    relatedId: Joi.string().custom(objectId),
    relatedType: Joi.string().valid('booking', 'tour', 'service', 'hotel', 'review'),
    priority: Joi.string().valid('low', 'normal', 'high'),
    data: Joi.object(),
  }),
};

const getNotifications = {
  query: Joi.object().keys({
    type: Joi.string().valid('booking', 'system', 'service', 'promotion', 'reminder'),
    isRead: Joi.boolean(),
    priority: Joi.string().valid('low', 'normal', 'high'),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getNotification = {
  params: Joi.object().keys({
    notificationId: Joi.string().custom(objectId),
  }),
};

const markAsRead = {
  params: Joi.object().keys({
    notificationId: Joi.string().custom(objectId),
  }),
};

const deleteNotification = {
  params: Joi.object().keys({
    notificationId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createNotification,
  getNotifications,
  getNotification,
  markAsRead,
  deleteNotification,
};
