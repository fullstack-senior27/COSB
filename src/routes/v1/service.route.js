const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { serviceController } = require('../../controllers');

// service routes  
const router = express.Router();
router
  .route('/create')
  .post(auth('manageSalons'), serviceController.createService)

router
  .route('/')
  .get(auth(), serviceController.getAllServices)

router
  .route('/:service_id')
  .get(auth(), serviceController.getService)
  .patch(auth('manageSalons'), serviceController.updateService)
  .delete(auth('manageSalons'), serviceController.deleteService)

module.exports = router;