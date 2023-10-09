const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { blogCategoryController } = require('../../controllers');
const { blogCategoryValidation } = require('../../validations');

const router = express.Router();

router
  .route('/create-blog-category')
  .post(auth('manageSalons'), validate(blogCategoryValidation.createBlogCategory), blogCategoryController.createBlogCategory)

router
  .route('/all')
  .get(auth(), blogCategoryController.listBlogCategories);
module.exports = router;
