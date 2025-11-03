const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const serviceValidation = require('../../validations/service.validation');
const serviceController = require('../../controllers/service.controller');

const router = express.Router();

router
  .route('/')
  .post(auth('manageServices'), validate(serviceValidation.createService), serviceController.createService)
  .get(validate(serviceValidation.getServices), serviceController.getServices);

router
  .route('/search')
  .get(validate(serviceValidation.searchServices), serviceController.searchServices);

router
  .route('/:serviceId')
  .get(validate(serviceValidation.getService), serviceController.getService)
  .patch(auth('manageServices'), validate(serviceValidation.updateService), serviceController.updateService)
  .delete(auth('manageServices'), validate(serviceValidation.deleteService), serviceController.deleteService);

module.exports = router;
