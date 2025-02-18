const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const {
  serviceValidation,
  appointmentValidation,
  productValidation,
  clientValidation,
  noteValidation,
} = require('../../validations');
const {
  beauticianController,
  serviceController,
  serviceCategoryController,
  availabilityController,
  appointmentController,
  productController,
  clientController,
  paymentController,
  promotionController,
  noteController,
} = require('../../controllers');

const router = express.Router();
router.route('/profile').post(beauticianController.getProfile);

router.route('/profile/edit').patch(auth('beautician', 'manageBeauticianProfile'), beauticianController.updateBeautician);

// public apis
router.route('/list').post(beauticianController.getBeauticians);

// router.route('/pictures').post(beauticianController.getPicturesByBeautician)

// service routes
router
  .route('/service/create')
  .post(auth('beautician', 'manageServices'), validate(serviceValidation.createService), serviceController.createService);

router
  .route('/service/edit/:service_id')
  .patch(auth('beautician', 'manageServices'), validate(serviceValidation.updateService), serviceController.updateService);
router.route('/service/delete/:service_id').delete(auth('beautician', 'manageServices'), serviceController.deleteService);

// service category routes
router
  .route('/service/category/create')
  .post(
    auth('beautician', 'manageServices'),
    validate(serviceValidation.createServiceCategory),
    serviceCategoryController.createCategory
  );

router
  .route('/service/category/:category_id')
  .patch(
    auth('beautician', 'manageServices'),
    validate(serviceValidation.updateServiceCategory),
    serviceCategoryController.updateCategory
  )
  .delete(
    auth('beautician', 'manageServices'),
    validate(serviceValidation.deleteServiceCategory),
    serviceCategoryController.deleteCategory
  );

// availability
router.route('/availability/add').patch(auth('beautician', 'manageServices'), availabilityController.addAvailability);
router.route('/availability/slots/add').patch(auth('beautician', 'manageServices'), availabilityController.updateSlots);

router.route('/availability/list').get(availabilityController.getAvailabilityForBeautician);

// appointments
router.route('/appointments/create').post(auth('beautician', 'manageAppointments'), appointmentController.createAppointment);

router
  .route('/appointment/:appointmentId')
  .get(
    auth('beautician', 'manageAppointments'),
    validate(appointmentValidation.getAppointmentDetails),
    appointmentController.getAppointmentDetails
  )
  .patch(
    auth('beautician', 'manageAppointments'),
    validate(appointmentValidation.updateAppointment),
    appointmentController.updateAppointment
  );

router
  .route('/appointments/all')
  .get(auth('beautician', 'manageAppointments'), appointmentController.getAppointmentByBeauticianId);

router
  .route('/products/create')
  .post(auth('beautician', 'manageProducts'), validate(productValidation.createProduct), productController.addProduct);

router.route('/products').get(productController.getAllProductsByBeautician);

// router.route('/products/:productId').delete(auth('beautician', 'manageProducts'), productController.deleteProduct)

router.route('/notes/create').post(auth('beautician', 'manageNotes'), noteController.createNote);
router.route('/notes/list').get(auth('beautician', 'manageNotes'), noteController.getNotesByClientId);

router
  .route('/products/edit/:productId')
  .patch(auth('beautician', 'manageProducts'), validate(productValidation.editProduct), productController.editProduct);

router
  .route('/products/delete/:productId')
  .delete(auth('beautician', 'manageProducts'), validate(productValidation.deleteProduct), productController.deleteProduct);

// reviews
router.route('/reviews').post(beauticianController.getAllReviewsByBeauticianId);

// clients
router.route('/clients').get(auth('beautician', 'manageClients'), clientController.getAllClientsForBeautician);

router
  .route('/clients/new/add')
  .post(
    auth('beautician', 'manageClients'),
    validate(clientValidation.registerNewClient),
    clientController.registerNewClient
  );

router.route('/clients/update').patch(auth('beautician', 'manageClients'), clientController.updateClient);

router.route('/clients/upload-image').post(auth('beautician', 'manageClients'), clientController.uploadClientPhoto);

router.route('/client/block').post(auth('beautician', 'manageClients'), clientController.blockClient);

router.route('/client/:clientId').get(auth('beautician', 'manageClients'), clientController.getClientDetails);
router.route('/client/delete').delete(auth('beautician', 'manageClients'), clientController.deleteClient);

router.route('/connect_account/create').get(auth('beautician', 'manageConnectAccount'), paymentController.createSeller);

router.route('/connect_account/create/success').get((req, res) => {
  res.json({
    message: 'Success',
  });
});

router.route('/connect_account/create/failed').get((req, res) => {
  res.json({
    message: 'failed',
  });
});

router.route('/connect_account/payments').get(auth('beautician', 'manageConnectAccount'), paymentController.listAllPayments);
router.route('/connect_account/payout').post(auth('beautician', 'manageConnectAccount'), paymentController.createPayout);
router.route('/connect_account/balance').get(auth('beautician', 'manageConnectAccount'), paymentController.getBalance);
router
  .route('/connect_account/balanceTransactions')
  .get(auth('beautician', 'manageConnectAccount'), paymentController.listBalanceTransactions);
router
  .route('/connect_account/payouts/list')
  .get(auth('beautician', 'manageConnectAccount'), paymentController.listAllPayouts);

router.route('/promotion/create').post(auth('beautician', 'managePromotions'), promotionController.createPromotion);
router.route('/promotion/list').get(promotionController.getPromotionsByBeautician);

router
  .route('/transactions-list')
  .get(auth('beautician', 'manageConnectAccount'), beauticianController.getListOfTransactions);

// router.route('/revenue-details').get(auth('beautician', 'manageConnectAccount'), beauticianController.getRevenueDetails);

router.route('/photos/get').get(auth('beautician', 'manageServices'), beauticianController.getPhotosFromGallery);
router.route('/photos/add').post(auth('beautician', 'manageServices'), beauticianController.addPhotosToGallery);
router.route('/photos/remove').post(auth('beautician', 'manageServices'), beauticianController.removePhotosByIndex);
module.exports = router;
