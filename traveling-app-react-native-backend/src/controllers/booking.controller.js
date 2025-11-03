const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { bookingService } = require('../services');

const createBooking = catchAsync(async (req, res) => {
  const booking = await bookingService.createBooking(req.user.id, req.body);
  res.status(httpStatus.CREATED).send(booking);
});

const getBookings = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['userId', 'tourId', 'status', 'paymentStatus', 'search']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await bookingService.queryBookings(filter, options);
  res.send(result);
});

const getBooking = catchAsync(async (req, res) => {
  const booking = await bookingService.getBookingById(req.params.bookingId);
  if (!booking) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Booking not found');
  }
  res.send(booking);
});

const updateBooking = catchAsync(async (req, res) => {
  const booking = await bookingService.updateBookingById(req.params.bookingId, req.body);
  res.send(booking);
});

const deleteBooking = catchAsync(async (req, res) => {
  await bookingService.deleteBookingById(req.params.bookingId);
  res.status(httpStatus.NO_CONTENT).send();
});

const getMyBookings = catchAsync(async (req, res) => {
  const filter = { userId: req.user.id };
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await bookingService.queryBookings(filter, options);
  res.send(result);
});

const cancelBooking = catchAsync(async (req, res) => {
  const booking = await bookingService.cancelBooking(req.params.bookingId, req.user.id, req.user.role);
  res.send(booking);
});

const confirmBooking = catchAsync(async (req, res) => {
  const booking = await bookingService.confirmBooking(req.params.bookingId);
  res.send(booking);
});

module.exports = {
  createBooking,
  getBookings,
  getBooking,
  updateBooking,
  deleteBooking,
  getMyBookings,
  cancelBooking,
  confirmBooking,
};
