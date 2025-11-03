const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const tourValidation = require('../../validations/tour.validation');
const tourController = require('../../controllers/tour.controller');

const router = express.Router();

router
  .route('/')
  .post(auth('manageTours'), validate(tourValidation.createTour), tourController.createTour)
  .get(validate(tourValidation.getTours), tourController.getTours);

router
  .route('/search')
  .get(validate(tourValidation.searchTours), tourController.searchTours);

router
  .route('/:tourId')
  .get(validate(tourValidation.getTour), tourController.getTour)
  .patch(auth('manageTours'), validate(tourValidation.updateTour), tourController.updateTour)
  .delete(auth('manageTours'), validate(tourValidation.deleteTour), tourController.deleteTour);

module.exports = router;
