const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const {
  blogController,
  blogCategoryController,
  serviceTypeController,
  pageController,
  adminController,
  appointmentController,
} = require('../../controllers');
const { blogValidation, blogCategoryValidation, serviceValidation } = require('../../validations');

const router = express.Router();

router
  .route('/blogs/create')
  .post(auth('admin', 'manageBlogs'), validate(blogValidation.createBlog), blogController.createBlog);

router
  .route('/blog/update/:blog_id')
  .patch(auth('admin', 'manageBlogs'), validate(blogValidation.updateBlog), blogController.updateBlog);
router.route('/blog/delete/:blog_id').delete(auth('admin', 'manageBlogs'), blogController.deleteBlog);

router
  .route('/blog/category/create')
  .post(
    auth('admin', 'manageBlogs'),
    validate(blogCategoryValidation.createBlogCategory),
    blogCategoryController.createBlogCategory
  );

router
  .route('/blog/category/update/:category_id')
  .patch(
    auth('admin', 'manageBlogs'),
    validate(blogCategoryValidation.createBlogCategory),
    blogCategoryController.updateBlogCategory
  );

router
  .route('/blog/category/delete/:category_id')
  .delete(auth('admin', 'manageBlogs'), blogCategoryController.deleteBlogCategory);

router
  .route('/service/type/create')
  .post(
    auth('admin', 'manageServiceTypes'),
    validate(serviceValidation.createServiceType),
    serviceTypeController.createServiceType
  );

router
  .route('/service/type/:serviceTypeId')
  .patch(
    auth('admin', 'manageServiceTypes'),
    validate(serviceValidation.updateServiceType),
    serviceTypeController.updateServiceType
  )
  .delete(
    auth('admin', 'manageServiceTypes'),
    validate(serviceValidation.deleteServiceType),
    serviceTypeController.deleteServiceType
  );

router.route('/pages/create').post(auth('admin', 'managePages'), pageController.createPage);

router
  .route('/pages/:pageId')
  .patch(auth('admin', 'managePages'), pageController.updatePage)
  .delete(auth('admin', 'managePages'), pageController.deletePage);

router.route('/list/users').get(auth('admin', 'managePages'), adminController.listUsers);
router.route('/list/beauticians').get(auth('admin', 'managePages'), adminController.listBeauticians);
router.route('/get-user-details').get(auth('admin', 'managePages'), adminController.getUserDetails);
router.route('/get-beautician-details').get(auth('admin', 'managePages'), adminController.getBeauticianDetails);

router
  .route('/beautician-appointment-list')
  .get(auth('admin', 'managePages'), adminController.getAppointmentListForBeautician);
router.route('/user-appointment-list').get(auth('admin', 'managePages'), adminController.getAppointmentListForUser);
router.route('/transaction-list').get(auth('admin', 'managePages'), adminController.getTransactionList);
router
  .route('/appointment-details/:appointmentId')
  .get(auth('admin', 'managePages'), appointmentController.getAppointmentDetails);
module.exports = router;
