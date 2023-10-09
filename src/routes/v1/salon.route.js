const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { salonController, serviceCategoryController, serviceController } = require('../../controllers');
// const userValidation = require('../../validations/user.validation');
// const userController = require('../../controllers/user.controller');

const router = express.Router();

router
  .route('/')
  .post(auth('manageSalons'), salonController.createSalon)
  .get(auth(), salonController.getSalons)

router.route('/:salon_id')
  .get(auth(), salonController.getSingleSalon)
  .post(auth(), salonController.giveReview)
  .patch(auth('manageSalons'), salonController.updateSalon)
  .delete(auth('manageSalons'), salonController.deleteSalon);


module.exports = router;
