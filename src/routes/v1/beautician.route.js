const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { beauticianController, serviceController, serviceCategoryController, availabilityController, appointmentController, productController } = require('../../controllers');

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


// availability
router
  .route('/availability/add')
  .post(auth('beautician', 'manageServices'), availabilityController.addAvailability)
router
  .route('/availability/edit')
  .patch(auth('beautician', 'manageServices'), availabilityController.updateDateAndTime)


router
  .route('/appointments/create')
  .post(auth('beautician', 'manageAppointments'), appointmentController.createAppointment)

router
  .route('/appointments/all')
  .get(auth('beautician', 'manageAppointments'), appointmentController.getAppointmentByBeauticianId)


router
  .route('/products/create')
  .post(auth('beautician', 'manageProducts'), productController.addProduct)

router.route('/products').get(productController.getAllProductsByBeautician)

router
  .route('/products/:productId')
  .patch(auth('beautician', 'manageProducts'), productController.editProduct)
  .delete(auth('beautician', 'manageProducts'), productController.deleteProduct)
  .get(productController.getProductDetails)
module.exports = router;
