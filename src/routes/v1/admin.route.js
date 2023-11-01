const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { blogController, blogCategoryController, serviceTypeController, pageController } = require('../../controllers');
const { blogValidation, blogCategoryValidation, serviceValidation } = require('../../validations');

const router = express.Router();

router
  .route('/blogs/create')
  .post(auth('admin', 'manageBlogs'), validate(blogValidation.createBlog), blogController.createBlog)

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
  .post(auth('admin', 'manageServiceTypes'), validate(serviceValidation.createServiceType), serviceTypeController.createServiceType)

router
  .route('/service/type/:serviceTypeId')
  .patch(auth('admin', 'manageServiceTypes'), validate(serviceValidation.updateServiceType), serviceTypeController.updateServiceType)
  .delete(auth('admin', 'manageServiceTypes'), validate(serviceValidation.deleteServiceType), serviceTypeController.deleteServiceType)


router.route('/pages/create').post(auth('admin', 'managePages'), pageController.createPage)

router.route('/pages/:pageId').patch(auth('admin', 'managePages'), pageController.updatePage).delete(auth('admin', 'managePages'), pageController.deletePage)
module.exports = router;
