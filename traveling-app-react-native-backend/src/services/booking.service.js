const httpStatus = require('http-status');
const { Booking, User, Tour } = require('../models');
const ApiError = require('../utils/ApiError');
const notificationService = require('./notification.service');

/**
 * Create a booking
 * @param {ObjectId} userId
 * @param {Object} bookingBody
 * @returns {Promise<Booking>}
 */
const createBooking = async (userId, bookingBody) => {
  const booking = await Booking.create({
    ...bookingBody,
    userId,
  });
  const populatedBooking = await booking.populate(['userId', 'tourId', 'hotelId', 'services']);
  
  // Send notification to user about successful booking creation
  try {
    await notificationService.createBookingNotification(
      userId,
      {
        bookingId: populatedBooking._id,
        tourName: populatedBooking.tourId?.name || 'Tour của bạn',
      },
      'created'
    );
  } catch (error) {
    console.error('Error sending booking creation notification:', error);
  }
  
  return populatedBooking;
};

/**
 * Query for bookings
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryBookings = async (filter, options) => {
  // Extract and remove search from filter
  const { search, ...restFilter } = filter;

  // If search exists, find matching users and tours first
  if (search) {
    // Search in User collection
    const users = await User.find({
      $or: [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ],
    }).select('_id');
    
    // Search in Tour collection
    const tours = await Tour.find({
      name: { $regex: search, $options: 'i' },
    }).select('_id');
    
    // Add userId and tourId to filter with $or
    const userIds = users.map(u => u._id);
    const tourIds = tours.map(t => t._id);
    
    if (userIds.length > 0 || tourIds.length > 0) {
      restFilter.$or = [];
      if (userIds.length > 0) {
        restFilter.$or.push({ userId: { $in: userIds } });
      }
      if (tourIds.length > 0) {
        restFilter.$or.push({ tourId: { $in: tourIds } });
      }
    } else {
      // No matching users or tours, return empty result
      return {
        results: [],
        page: options.page || 1,
        limit: options.limit || 10,
        totalPages: 0,
        totalResults: 0,
      };
    }
  }

  const bookings = await Booking.paginate(restFilter, {
    ...options,
    populate: 'userId,tourId,hotelId,services',
  });
  return bookings;
};

/**
 * Get booking by id
 * @param {ObjectId} id
 * @returns {Promise<Booking>}
 */
const getBookingById = async (id) => {
  return Booking.findById(id).populate(['userId', 'tourId', 'hotelId', 'services']);
};

/**
 * Update booking by id
 * @param {ObjectId} bookingId
 * @param {Object} updateBody
 * @returns {Promise<Booking>}
 */
const updateBookingById = async (bookingId, updateBody) => {
  const booking = await getBookingById(bookingId);
  if (!booking) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Booking not found');
  }
  
  const oldStatus = booking.status;
  Object.assign(booking, updateBody);
  await booking.save();
  
  // Send notification if status changed to cancelled by admin
  if (oldStatus !== 'cancelled' && updateBody.status === 'cancelled') {
    try {
      await notificationService.createBookingNotification(
        booking.userId._id || booking.userId,
        {
          bookingId: booking._id,
          tourName: booking.tourId?.name || 'Tour của bạn',
        },
        'cancelled'
      );
    } catch (error) {
      console.error('Error sending cancellation notification:', error);
    }
  }
  
  return booking;
};

/**
 * Delete booking by id
 * @param {ObjectId} bookingId
 * @returns {Promise<Booking>}
 */
const deleteBookingById = async (bookingId) => {
  const booking = await getBookingById(bookingId);
  if (!booking) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Booking not found');
  }
  await booking.remove();
  return booking;
};

/**
 * Cancel booking
 * @param {ObjectId} bookingId
 * @param {ObjectId} userId
 * @param {string} userRole - Role of the user making the request
 * @returns {Promise<Booking>}
 */
const cancelBooking = async (bookingId, userId, userRole) => {
  const booking = await Booking.findById(bookingId);
  if (!booking) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Booking not found');
  }
  
  console.log('🔍 Cancel booking debug:');
  console.log('  - bookingId:', bookingId);
  console.log('  - userId:', userId);
  console.log('  - userRole:', userRole);
  console.log('  - booking.userId:', booking.userId.toString());
  console.log('  - Match:', booking.userId.toString() === userId.toString());
  
  // Admin can cancel any booking, user can only cancel their own
  if (userRole !== 'admin' && booking.userId.toString() !== userId.toString()) {
    throw new ApiError(httpStatus.FORBIDDEN, 'You can only cancel your own bookings');
  }
  
  if (booking.status === 'cancelled' || booking.status === 'completed') {
    throw new ApiError(httpStatus.BAD_REQUEST, `Cannot cancel a ${booking.status} booking`);
  }
  
  booking.status = 'cancelled';
  await booking.save();
  
  // Send notification to user about booking cancellation
  try {
    const populatedBooking = await booking.populate(['userId', 'tourId']);
    await notificationService.createBookingNotification(
      booking.userId,
      {
        bookingId: booking._id,
        tourName: populatedBooking.tourId?.name || 'Tour của bạn',
        cancelledBy: userRole === 'admin' ? 'admin' : 'user',
      },
      'cancelled'
    );
  } catch (error) {
    console.error('Error sending booking cancellation notification:', error);
  }
  
  return booking;
};

/**
 * Confirm booking
 * @param {ObjectId} bookingId
 * @returns {Promise<Booking>}
 */
const confirmBooking = async (bookingId) => {
  const booking = await getBookingById(bookingId);
  if (!booking) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Booking not found');
  }
  if (booking.status !== 'pending') {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Only pending bookings can be confirmed');
  }
  booking.status = 'confirmed';
  await booking.save();
  
  // Send notification to user
  try {
    await notificationService.createBookingNotification(
      booking.userId._id || booking.userId,
      {
        bookingId: booking._id,
        tourName: booking.tourId?.name || 'Tour của bạn',
      },
      'confirmed'
    );
  } catch (error) {
    console.error('Error sending confirmation notification:', error);
    // Don't fail the booking confirmation if notification fails
  }
  
  return booking;
};

module.exports = {
  createBooking,
  queryBookings,
  getBookingById,
  updateBookingById,
  deleteBookingById,
  cancelBooking,
  confirmBooking,
};
