const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { serviceController, serviceTypeController, serviceCategoryController } = require('../../controllers');

// service routes  
const router = express.Router();
// router
//   .route('/create')
//   .post(auth('beautician', 'manageServices'), serviceController.createService)

router
  .route('/all')
  .get(serviceController.getAllServices)

router
  .route('/categories/all')
  .get(serviceCategoryController.getAllCategories)

router
  .route('/types/all')
  .get(serviceTypeController.getAllServiceTypes)

// router
//   .route('/:service_id')
//   .get(serviceController.getService)
//   .patch(auth('beautician'), serviceController.updateService)
//   .delete(auth('beautician'), serviceController.deleteService)

module.exports = router;