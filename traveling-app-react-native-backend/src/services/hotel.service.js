const httpStatus = require('http-status');
const { Hotel } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a hotel
 * @param {Object} hotelBody
 * @returns {Promise<Hotel>}
 */
const createHotel = async (hotelBody) => {
  return Hotel.create(hotelBody);
};

/**
 * Query for hotels
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryHotels = async (filter, options) => {
  const hotels = await Hotel.paginate(filter, options);
  return hotels;
};

/**
 * Get hotel by id
 * @param {ObjectId} id
 * @returns {Promise<Hotel>}
 */
const getHotelById = async (id) => {
  return Hotel.findById(id);
};

/**
 * Update hotel by id
 * @param {ObjectId} hotelId
 * @param {Object} updateBody
 * @returns {Promise<Hotel>}
 */
const updateHotelById = async (hotelId, updateBody) => {
  const hotel = await getHotelById(hotelId);
  if (!hotel) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Hotel not found');
  }
  Object.assign(hotel, updateBody);
  await hotel.save();
  return hotel;
};

/**
 * Delete hotel by id
 * @param {ObjectId} hotelId
 * @returns {Promise<Hotel>}
 */
const deleteHotelById = async (hotelId) => {
  const hotel = await getHotelById(hotelId);
  if (!hotel) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Hotel not found');
  }
  await hotel.remove();
  return hotel;
};

/**
 * Search hotels with filters
 * @param {Object} filter - Search filters
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
const searchHotels = async (filter, options) => {
  const query = {};
  
  if (filter.city) {
    query.city = { $regex: filter.city, $options: 'i' };
  }
  
  if (filter.minPrice || filter.maxPrice) {
    query.pricePerNight = {};
    if (filter.minPrice) {
      query.pricePerNight.$gte = Number(filter.minPrice);
    }
    if (filter.maxPrice) {
      query.pricePerNight.$lte = Number(filter.maxPrice);
    }
  }
  
  if (filter.minRating) {
    query.rating = { $gte: Number(filter.minRating) };
  }
  
  return Hotel.paginate(query, options);
};

module.exports = {
  createHotel,
  queryHotels,
  getHotelById,
  updateHotelById,
  deleteHotelById,
  searchHotels,
};
