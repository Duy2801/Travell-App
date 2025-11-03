const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createTour = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    description: Joi.string(),
    destination: Joi.string().required(),
    duration: Joi.string(),
    pricePerPerson: Joi.number().required().min(0),
    itinerary: Joi.array().items(
      Joi.object().keys({
        day: Joi.number().required(),
        activities: Joi.array().items(Joi.string()),
      })
    ),
    images: Joi.array().items(Joi.string()),
    includedServices: Joi.array().items(Joi.string()),
    hotels: Joi.array().items(Joi.string().custom(objectId)),
  }),
};

const getTours = {
  query: Joi.object().keys({
    name: Joi.string(),
    destination: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getTour = {
  params: Joi.object().keys({
    tourId: Joi.string().custom(objectId),
  }),
};

const updateTour = {
  params: Joi.object().keys({
    tourId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      name: Joi.string(),
      description: Joi.string(),
      destination: Joi.string(),
      duration: Joi.string(),
      pricePerPerson: Joi.number().min(0),
      itinerary: Joi.array().items(
        Joi.object().keys({
          day: Joi.number().required(),
          activities: Joi.array().items(Joi.string()),
        })
      ),
      images: Joi.array().items(Joi.string()),
      includedServices: Joi.array().items(Joi.string()),
      hotels: Joi.array().items(Joi.string().custom(objectId)),
    })
    .min(1),
};

const deleteTour = {
  params: Joi.object().keys({
    tourId: Joi.string().custom(objectId),
  }),
};

const searchTours = {
  query: Joi.object().keys({
    destination: Joi.string(),
    minPrice: Joi.number().min(0),
    maxPrice: Joi.number().min(0),
    duration: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

module.exports = {
  createTour,
  getTours,
  getTour,
  updateTour,
  deleteTour,
  searchTours,
};
