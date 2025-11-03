const httpStatus = require('http-status');
const { Tour } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a tour
 * @param {Object} tourBody
 * @returns {Promise<Tour>}
 */
const createTour = async (tourBody) => {
  return Tour.create(tourBody);
};

/**
 * Query for tours
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryTours = async (filter, options) => {
  // Convert destination string to regex for partial matching
  if (filter.destination && typeof filter.destination === 'string') {
    filter.destination = { $regex: filter.destination, $options: 'i' };
  }
  
  // Convert name string to regex for partial matching
  if (filter.name && typeof filter.name === 'string') {
    filter.name = { $regex: filter.name, $options: 'i' };
  }
  
  const tours = await Tour.paginate(filter, {
    ...options,
    populate: 'hotels',
  });
  return tours;
};

/**
 * Get tour by id
 * @param {ObjectId} id
 * @returns {Promise<Tour>}
 */
const getTourById = async (id) => {
  return Tour.findById(id).populate('hotels');
};

/**
 * Update tour by id
 * @param {ObjectId} tourId
 * @param {Object} updateBody
 * @returns {Promise<Tour>}
 */
const updateTourById = async (tourId, updateBody) => {
  const tour = await getTourById(tourId);
  if (!tour) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Tour not found');
  }
  Object.assign(tour, updateBody);
  await tour.save();
  return tour;
};

/**
 * Delete tour by id
 * @param {ObjectId} tourId
 * @returns {Promise<Tour>}
 */
const deleteTourById = async (tourId) => {
  const tour = await getTourById(tourId);
  if (!tour) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Tour not found');
  }
  await tour.remove();
  return tour;
};

/**
 * Search tours with filters
 * @param {Object} filter - Search filters
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
const searchTours = async (filter, options) => {
  const query = {};
  
  if (filter.destination) {
    query.destination = { $regex: filter.destination, $options: 'i' };
  }
  
  if (filter.minPrice || filter.maxPrice) {
    query.pricePerPerson = {};
    if (filter.minPrice) {
      query.pricePerPerson.$gte = Number(filter.minPrice);
    }
    if (filter.maxPrice) {
      query.pricePerPerson.$lte = Number(filter.maxPrice);
    }
  }
  
  if (filter.duration) {
    query.duration = filter.duration;
  }
  
  return Tour.paginate(query, options);
};

module.exports = {
  createTour,
  queryTours,
  getTourById,
  updateTourById,
  deleteTourById,
  searchTours,
};
