const express = require('express');
const validate = require('../../middlewares/validate');
const BeauticianValidation = require('../../validations/beautician.validation');
const Beautician = require('../../models/beautician.model');
const router = express.Router();
const BeauticianController = require('../../controllers/beautician.controller');

router
  .route('/create-beautician')
  .post(validate(BeauticianValidation.createBeautician), BeauticianController.createBeautician);

// beautician
router.route('/get-all-beautician').get(BeauticianController.getAllBeautician);
router.route('/get-beautician/:id').get(BeauticianController.getBeautician);

// salon
router.route('/create-salon').post(validate(BeauticianValidation.createSalon), BeauticianController.createSalon);
router.route('/get-all-salon').post(BeauticianController.getAllSalon);
router.route('/get-salon-by-beautician/:id').get(BeauticianController.getAllSalonByBeautician);

// service
router.route('/get-all-service').post(BeauticianController.getAllService);
router.route('/get-salon-by-id/:id').get(BeauticianController.getSalonById);
router.route('/search').post(BeauticianController.search);
router.route('/get-service-by-salon/:id').get(BeauticianController.getServiceBySalon);

// service type
router
  .route('/create-service-type')
  .post(validate(BeauticianValidation.createServiceType), BeauticianController.createServiceType);

// salon rating
router.route('/create-rating').post(validate(BeauticianValidation.createRating), BeauticianController.createRating);

// router.route('/create-service').post(validate(BeauticianValidation.createService), BeauticianController.createService);


// test
router.route('/test').post(BeauticianController.test);


module.exports = router;
