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
const { blogValidation, blogCategoryValidation, serviceValidation, adminValidation } = require('../../validations');

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

// CMS routes
router.route('/cms/help/create').post(auth('admin', 'managePages'), adminController.createHelpContent);
router.route('/cms/help/edit').patch(auth('admin', 'managePages'), adminController.editHelpContent);
router.route('/cms/help/delete').delete(auth('admin', 'managePages'), adminController.deleteHelpContent);
router.route('/cms/help/view').get(adminController.getHelpContent);
router.route('/cms/help/view/:id').get(adminController.getIndividualHelpQuery);

router.route('/cms/knowledgeBase/create').post(auth('admin', 'managePages'), adminController.createKnowledgeBaseContent);
router.route('/cms/knowledgeBase/edit').patch(auth('admin', 'managePages'), adminController.editKnowledgeBaseContent);
router.route('/cms/knowledgeBase/delete').delete(auth('admin', 'managePages'), adminController.deleteKnowledgeBaseContent);
router.route('/cms/knowledgeBase/view-all').get(adminController.getAllKnowledgeBaseContent);
router.route('/cms/knowledgeBase/get-by-id').get(adminController.getKnowledgeBaseContentById);

router.route('/profile/update').patch(auth('admin', 'managePages'), validate(adminValidation.editProfile), adminController.editProfile)
router.route('/profile/get').get(auth('admin', 'managePages'), adminController.getProfile)
module.exports = router;
