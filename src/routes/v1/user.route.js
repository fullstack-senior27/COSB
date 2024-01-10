const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
// const userValidation = require('../../validations/user.validation');
const userController = require('../../controllers/user.controller');
// const appointmentController = require('../../controllers/appointment.controller');
const { appointmentController, paymentController } = require('../../controllers');
const { appointmentValidation, reviewValidation, userValidation } = require('../../validations');

const router = express.Router();

// router
//   .route('/')
//   .post(auth('beautician', 'manageUsers'), validate(userValidation.createUser), userController.createUser)
//   .get(auth('getUsers'), validate(userValidation.getUsers), userController.getUsers);

router
  .route('/profile/update')
  //   .get(auth('getUsers'), validate(userValidation.getUser), userController.getUser)
  .patch(auth('user', 'manageProfile'), userController.updateUser);
//   .delete(auth('manageUsers'), validate(userValidation.deleteUser), userController.deleteUser);

router
  .route('/change_password')
  .patch(auth('user', 'manageProfile'), validate(userValidation.changePassword), userController.changePassword);

router.route('/profile').get(auth('user', 'manageProfile'), userController.getProfile);

router.route('/appointments/all').get(auth('user', 'manageAppointments'), appointmentController.getAppointmentsByUserId);

router.route('/appointment/create').post(auth('user', 'makeAppointments'), appointmentController.createAppointment);

// router
//   .route('/appointment/update/:appointmentId')
//   .patch(auth('user', 'manageAppointments'), appointmentController.updateAppointment)

router
  .route('/appointment/:appointmentId')
  .get(
    auth('user', 'manageAppointments'),
    validate(appointmentValidation.getAppointmentDetails),
    appointmentController.getAppointmentDetails
  );
router
  .route('/appointment/update/:appointmentId')
  .patch(
    auth('user', 'manageAppointments'),
    validate(appointmentValidation.updateAppointment),
    appointmentController.updateAppointment
  );

router
  .route('/review/create')
  .post(auth('user', 'createReviews'), validate(reviewValidation.createReview), userController.reviewBeautician);

router
  .route('/review/update/:reviewId')
  .patch(auth('user', 'createReviews'), validate(reviewValidation.updateReview), userController.updateReview);

router.route('/card/create').post(auth('user', 'makePayments'), paymentController.createCustomer);
router.route('/payment/create').post(auth('user', 'makePayments'), paymentController.processPayment);

router.route('/cards/list').get(auth('user', 'makePayments'), paymentController.listCardsForUser);
router.route('/card/delete/:cardId').delete(auth('user', 'makePayments'), paymentController.deleteCard);

module.exports = router;
