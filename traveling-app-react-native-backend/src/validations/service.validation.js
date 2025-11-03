const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createService = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    description: Joi.string(),
    price: Joi.number().required().min(0),
    type: Joi.string().valid('transport', 'food', 'guide', 'ticket', 'other'),
  }),
};

const getServices = {
  query: Joi.object().keys({
    name: Joi.string(),
    type: Joi.string().valid('transport', 'food', 'guide', 'ticket', 'other'),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getService = {
  params: Joi.object().keys({
    serviceId: Joi.string().custom(objectId),
  }),
};

const updateService = {
  params: Joi.object().keys({
    serviceId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      name: Joi.string(),
      description: Joi.string(),
      price: Joi.number().min(0),
      type: Joi.string().valid('transport', 'food', 'guide', 'ticket', 'other'),
    })
    .min(1),
};

const deleteService = {
  params: Joi.object().keys({
    serviceId: Joi.string().custom(objectId),
  }),
};

const searchServices = {
  query: Joi.object().keys({
    type: Joi.string().valid('transport', 'food', 'guide', 'ticket', 'other'),
    minPrice: Joi.number().min(0),
    maxPrice: Joi.number().min(0),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

module.exports = {
  createService,
  getServices,
  getService,
  updateService,
  deleteService,
  searchServices,
};
