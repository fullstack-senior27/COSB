const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { serviceCategoryController } = require('../../controllers');

const router = express.Router();
// Service category routes  
router
  .route('/create_service_category')
  .post(auth('manageSalons'), serviceCategoryController.createCategory)
router
  .route('/')
  .get(auth(), serviceCategoryController.getAllCategories)
router
  .route('/:category_id')
  .get(auth(), serviceCategoryController.getCategory)
  .patch(auth('manageSalons'), serviceCategoryController.updateCategory)
  .delete(auth('manageSalons'), serviceCategoryController.deleteCategory)

module.exports = router;