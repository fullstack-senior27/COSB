const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const userValidation = require('../../validations/user.validation');
const userController = require('../../controllers/user.controller');
const { appointmentController } = require('../../controllers');

const router = express.Router();

// router
//   .route('/')
//   .post(auth('beautician', 'manageUsers'), validate(userValidation.createUser), userController.createUser)
//   .get(auth('getUsers'), validate(userValidation.getUsers), userController.getUsers);

// router
//   .route('/:userId')
//   .get(auth('getUsers'), validate(userValidation.getUser), userController.getUser)
//   .patch(auth('manageUsers'), validate(userValidation.updateUser), userController.updateUser)
//   .delete(auth('manageUsers'), validate(userValidation.deleteUser), userController.deleteUser);

router
  .route('/profile')
  .get(auth('user', 'manageProfile'), userController.getProfile)

router
  .route('/appointments')
  .get(auth('user', 'manageAppointments'), userController.getAppointmentsByUserId)

router
  .route('/appointment/create')
  .post(auth('user', "makeAppointments"), appointmentController.createAppointment)

router
  .route('/appointment/update/:appointmentId')
  .patch(auth('user', 'manageAppointments'), appointmentController.updateAppointment)
module.exports = router;

