const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createBooking = {
  body: Joi.object().keys({
    tourId: Joi.string().required().custom(objectId),
    hotelId: Joi.string().custom(objectId),
    services: Joi.array().items(Joi.string().custom(objectId)),
    numberOfPeople: Joi.number().required().min(1),
    startDate: Joi.date().required(),
    endDate: Joi.date().required().min(Joi.ref('startDate')),
    totalPrice: Joi.number().required().min(0),
    status: Joi.string().valid('pending', 'confirmed', 'cancelled', 'completed'),
    paymentStatus: Joi.string().valid('unpaid', 'paid', 'refunded'),
  }),
};

const getBookings = {
  query: Joi.object().keys({
    userId: Joi.string().custom(objectId),
    tourId: Joi.string().custom(objectId),
    status: Joi.string().valid('pending', 'confirmed', 'cancelled', 'completed'),
    paymentStatus: Joi.string().valid('unpaid', 'paid', 'refunded'),
    search: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getBooking = {
  params: Joi.object().keys({
    bookingId: Joi.string().custom(objectId),
  }),
};

const updateBooking = {
  params: Joi.object().keys({
    bookingId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      tourId: Joi.string().custom(objectId),
      hotelId: Joi.string().custom(objectId),
      services: Joi.array().items(Joi.string().custom(objectId)),
      numberOfPeople: Joi.number().min(1),
      startDate: Joi.date(),
      endDate: Joi.date(),
      totalPrice: Joi.number().min(0),
      status: Joi.string().valid('pending', 'confirmed', 'cancelled', 'completed'),
      paymentStatus: Joi.string().valid('unpaid', 'paid', 'refunded'),
    })
    .min(1),
};

const deleteBooking = {
  params: Joi.object().keys({
    bookingId: Joi.string().custom(objectId),
  }),
};

const cancelBooking = {
  params: Joi.object().keys({
    bookingId: Joi.string().custom(objectId),
  }),
};

const confirmBooking = {
  params: Joi.object().keys({
    bookingId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createBooking,
  getBookings,
  getBooking,
  updateBooking,
  deleteBooking,
  cancelBooking,
  confirmBooking,
};
