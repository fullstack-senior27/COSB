const express = require('express');
const validate = require('../../middlewares/validate');
const BeauticianValidation = require('../../validations/beautician.validation');
const Beautician = require('../../models/beautician.model');
const router = express.Router();
const BeauticianController = require('../../controllers/beautician.controller');

router
  .route('/create-beautician')
  .post(validate(BeauticianValidation.createBeautician), BeauticianController.createBeautician);
router.route('/get-all-beautician').get(BeauticianController.getAllBeautician);

router.route('/create-salon').post(validate(BeauticianValidation.createSalon), BeauticianController.createSalon);
router.route('/get-all-salon').get(BeauticianController.getAllSalon);
router.route('/get-all-service').get(BeauticianController.getAllService);

router.route('/get-salon-by-id/:id').post(BeauticianController.getSalonById);

router.route('/search').post(BeauticianController.search);

// router.route('/create-service').post(validate(BeauticianValidation.createService), BeauticianController.createService);

module.exports = router;
