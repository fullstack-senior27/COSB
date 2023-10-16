const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { blogController, blogCategoryController, serviceTypeController } = require('../../controllers');
const { blogValidation, blogCategoryValidation } = require('../../validations');

const router = express.Router();

router
  .route('/blogs/create')
  .post(auth('admin', 'manageBlogs'), blogController.createBlog)

router.route('/blog/:blog_id')
  .patch(auth('admin', 'manageBlogs'), validate(blogValidation.updateBlog), blogController.updateBlog)
  .delete(auth('admin', 'manageBlogs'), validate(blogValidation.getBlog), blogController.deleteBlog);

router
  .route('/blog/category/create')
  .post(auth('admin', 'manageBlogs'), validate(blogCategoryValidation.createBlogCategory), blogCategoryController.createBlogCategory)

router
  .route('/blog/category/:category_id')
  .put(auth('admin', 'manageBlogs'), validate(blogCategoryValidation.createBlogCategory), blogCategoryController.updateBlogCategory)
  .delete(auth('admin', 'manageBlogs'), blogCategoryController.deleteBlogCategory)

router
  .route('/service/type/create')
  .post(auth('admin', 'manageServiceTypes'), serviceTypeController.createServiceType)

router
  .route('/service/type/:serviceTypeId')
  .patch(auth('admin', 'manageServiceTypes'), serviceTypeController.updateServiceType)

module.exports = router;
