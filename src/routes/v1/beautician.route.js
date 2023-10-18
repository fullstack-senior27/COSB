const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { beauticianController, blogController, serviceController, serviceCategoryController } = require('../../controllers');

const router = express.Router();

router
  .route('/profile')
  .get(auth('beautician', 'manageBeauticianProfile'), beauticianController.getProfile)

router
  .route('/edit')
  .patch(auth('beautician', 'manageBeauticianProfile'), beauticianController.updateBeautician)

router
  .route('/')
  .get(beauticianController.getBeauticians)

// service routes
router
  .route('/service/create')
  .post(auth('beautician', 'manageServices'), serviceController.createService);

router
  .route('/service/:service_id')
  .patch(auth('beautician', 'manageServices'), serviceController.updateService)
  .delete(auth('beautician', 'manageServices'), serviceController.deleteService)

// service category routes
router
  .route('/service/category/create')
  .post(auth('beautician', 'manageServices'), serviceCategoryController.createCategory)

router
  .route('/service/category/:category_id')
  .patch(auth('beautician', 'manageServices'), serviceCategoryController.updateCategory)
  .delete(auth('beautician', 'manageServices'), serviceCategoryController.deleteCategory)
module.exports = router;
