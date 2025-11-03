const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const bookingValidation = require('../../validations/booking.validation');
const bookingController = require('../../controllers/booking.controller');

const router = express.Router();

router
  .route('/')
  .post(auth(), validate(bookingValidation.createBooking), bookingController.createBooking)
  .get(auth('manageBookings'), validate(bookingValidation.getBookings), bookingController.getBookings);

router
  .route('/my-bookings')
  .get(auth(), bookingController.getMyBookings);

router
  .route('/:bookingId')
  .get(auth(), validate(bookingValidation.getBooking), bookingController.getBooking)
  .patch(auth('manageBookings'), validate(bookingValidation.updateBooking), bookingController.updateBooking)
  .delete(auth('manageBookings'), validate(bookingValidation.deleteBooking), bookingController.deleteBooking);

router
  .route('/:bookingId/cancel')
  .patch(auth(), validate(bookingValidation.cancelBooking), bookingController.cancelBooking);

router
  .route('/:bookingId/confirm')
  .patch(auth('manageBookings'), validate(bookingValidation.confirmBooking), bookingController.confirmBooking);

module.exports = router;
