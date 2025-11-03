const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const hotelValidation = require('../../validations/hotel.validation');
const hotelController = require('../../controllers/hotel.controller');

const router = express.Router();

router
  .route('/')
  .post(auth('manageHotels'), validate(hotelValidation.createHotel), hotelController.createHotel)
  .get(validate(hotelValidation.getHotels), hotelController.getHotels);

router
  .route('/search')
  .get(validate(hotelValidation.searchHotels), hotelController.searchHotels);

router
  .route('/:hotelId')
  .get(validate(hotelValidation.getHotel), hotelController.getHotel)
  .patch(auth('manageHotels'), validate(hotelValidation.updateHotel), hotelController.updateHotel)
  .delete(auth('manageHotels'), validate(hotelValidation.deleteHotel), hotelController.deleteHotel);

module.exports = router;
