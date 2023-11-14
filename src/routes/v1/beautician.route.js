const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { serviceValidation, appointmentValidation, productValidation, clientValidation } = require('../../validations')
const { beauticianController, serviceController, serviceCategoryController, availabilityController, appointmentController, productController, clientController, paymentController } = require('../../controllers');

const router = express.Router();

router
  .route('/profile')
  .get(auth('beautician', 'manageBeauticianProfile'), beauticianController.getProfile)

router
  .route('/profile/edit')
  .patch(auth('beautician', 'manageBeauticianProfile'), beauticianController.updateBeautician)

router
  .route('/list')
  .post(beauticianController.getBeauticians)

// service routes
router
  .route('/service/create')
  .post(auth('beautician', 'manageServices'), validate(serviceValidation.createService), serviceController.createService);

router
  .route('/service/edit/:service_id')
  .patch(auth('beautician', 'manageServices'), validate(serviceValidation.updateService), serviceController.updateService)
router.route('/service/delete/:service_id')
  .delete(auth('beautician', 'manageServices'), serviceController.deleteService)

// service category routes
router
  .route('/service/category/create')
  .post(auth('beautician', 'manageServices'), validate(serviceValidation.createServiceCategory), serviceCategoryController.createCategory)

router
  .route('/service/category/:category_id')
  .patch(auth('beautician', 'manageServices'), validate(serviceValidation.updateServiceCategory), serviceCategoryController.updateCategory)
  .delete(auth('beautician', 'manageServices'), validate(serviceValidation.deleteServiceCategory), serviceCategoryController.deleteCategory)


// availability
router
  .route('/availability/add')
  .patch(auth('beautician', 'manageServices'), availabilityController.addAvailability)
router
  .route('/availability/edit')
  .patch(auth('beautician', 'manageServices'), availabilityController.updateDateAndTime)

// appointments
router
  .route('/appointments/create')
  .post(auth('beautician', 'manageAppointments'), validate(appointmentValidation.createAppointment), appointmentController.createAppointment)

router
  .route('/appointment/:appointmentId')
  .get(auth('beautician', 'manageAppointments'), validate(appointmentValidation.getAppointmentDetails), appointmentController.getAppointmentDetails)
  .patch(auth('beautician', 'manageAppointments'), validate(appointmentValidation.updateAppointment), appointmentController.updateAppointment)

router
  .route('/appointments/all')
  .get(auth('beautician', 'manageAppointments'), appointmentController.getAppointmentByBeauticianId)


router
  .route('/products/create')
  .post(auth('beautician', 'manageProducts'), validate(productValidation.createProduct), productController.addProduct)

router.route('/products').get(productController.getAllProductsByBeautician)

router
  .route('/products/:productId')
  .patch(auth('beautician', 'manageProducts'), validate(productValidation.editProduct), productController.editProduct)
  .delete(auth('beautician', 'manageProducts'), validate(productValidation.deleteProduct), productController.deleteProduct)
  .get(validate(productValidation.getProductDetails), productController.getProductDetails)

// reviews
router
  .route('/reviews')
  .post(beauticianController.getAllReviewsByBeauticianId)

// clients
router
  .route('/clients')
  .get(auth('beautician', 'manageClients'), clientController.getAllClientsForBeautician)

router
  .route('/clients/new/add')
  .post(auth('beautician', 'manageClients'), validate(clientValidation.registerNewClient), clientController.registerNewClient)

router
  .route('/clients/update')
  .patch(auth('beautician', 'manageClients'), clientController.updateClient)

router.route('/client/block').post(auth('beautician', 'manageClients'), clientController.blockClient)

router
  .route('/connect_account/create')
  .get(auth('beautician', 'manageConnectAccount'), paymentController.createSeller)

router
  .route('/connect_account/create/success')
  .get((req, res) => {
    res.json({
      message: "Success"
    })
  })

router
  .route('/connect_account/create/failed')
  .get((req, res) => {
    res.json({
      message: "failed"
    })
  })

router.route('/connect_account/payments').get(auth('beautician', 'manageConnectAccount'), paymentController.listAllPayments)
router.route('/connect_account/payout').post(auth('beautician', 'manageConnectAccount'), paymentController.createPayout)
router.route('/connect_account/balance').get(auth('beautician', 'manageConnectAccount'), paymentController.getBalance)
router.route('/connect_account/balanceTransactions').get(auth('beautician', 'manageConnectAccount'), paymentController.listBalanceTransactions)
router.route('/connect_account/payouts/list').get(auth('beautician', 'manageConnectAccount'), paymentController.listAllPayouts)

module.exports = router;
