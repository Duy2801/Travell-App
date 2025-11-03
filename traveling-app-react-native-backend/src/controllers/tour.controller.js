const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { tourService } = require('../services');

const createTour = catchAsync(async (req, res) => {
  const tour = await tourService.createTour(req.body);
  res.status(httpStatus.CREATED).send(tour);
});

const getTours = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['destination', 'name']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  
  // Support price filtering in main getTours endpoint
  if (req.query.minPrice || req.query.maxPrice) {
    const priceFilter = {};
    if (req.query.minPrice) priceFilter.$gte = Number(req.query.minPrice);
    if (req.query.maxPrice) priceFilter.$lte = Number(req.query.maxPrice);
    filter.pricePerPerson = priceFilter;
  }
  
  const result = await tourService.queryTours(filter, options);
  res.send(result);
});

const getTour = catchAsync(async (req, res) => {
  const tour = await tourService.getTourById(req.params.tourId);
  if (!tour) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Tour not found');
  }
  res.send(tour);
});

const updateTour = catchAsync(async (req, res) => {
  const tour = await tourService.updateTourById(req.params.tourId, req.body);
  res.send(tour);
});

const deleteTour = catchAsync(async (req, res) => {
  await tourService.deleteTourById(req.params.tourId);
  res.status(httpStatus.NO_CONTENT).send();
});

const searchTours = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['destination', 'minPrice', 'maxPrice', 'duration']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await tourService.searchTours(filter, options);
  res.send(result);
});

module.exports = {
  createTour,
  getTours,
  getTour,
  updateTour,
  deleteTour,
  searchTours,
};
