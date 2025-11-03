const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createHotel = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    address: Joi.string().required(),
    city: Joi.string().required(),
    description: Joi.string(),
    rating: Joi.number().min(0).max(5),
    pricePerNight: Joi.number().required().min(0),
    amenities: Joi.array().items(Joi.string()),
    images: Joi.array().items(Joi.string()),
    contactInfo: Joi.object().keys({
      phone: Joi.string(),
      email: Joi.string().email(),
    }),
  }),
};

const getHotels = {
  query: Joi.object().keys({
    name: Joi.string(),
    city: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getHotel = {
  params: Joi.object().keys({
    hotelId: Joi.string().custom(objectId),
  }),
};

const updateHotel = {
  params: Joi.object().keys({
    hotelId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      name: Joi.string(),
      address: Joi.string(),
      city: Joi.string(),
      description: Joi.string(),
      rating: Joi.number().min(0).max(5),
      pricePerNight: Joi.number().min(0),
      amenities: Joi.array().items(Joi.string()),
      images: Joi.array().items(Joi.string()),
      contactInfo: Joi.object().keys({
        phone: Joi.string(),
        email: Joi.string().email(),
      }),
    })
    .min(1),
};

const deleteHotel = {
  params: Joi.object().keys({
    hotelId: Joi.string().custom(objectId),
  }),
};

const searchHotels = {
  query: Joi.object().keys({
    city: Joi.string(),
    minPrice: Joi.number().min(0),
    maxPrice: Joi.number().min(0),
    minRating: Joi.number().min(0).max(5),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

module.exports = {
  createHotel,
  getHotels,
  getHotel,
  updateHotel,
  deleteHotel,
  searchHotels,
};
