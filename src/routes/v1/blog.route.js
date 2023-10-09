const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { blogController } = require('../../controllers');
const { blogValidation } = require('../../validations');

const router = express.Router();

router
  .route('/create-blog')
  .post(auth('manageSalons'), validate(blogValidation.createBlog), blogController.createBlog)

router.route('/').get(auth(), blogController.getBlogs);
router
  .route('/:blog_id')
  .get(auth(), validate(blogValidation.getBlog), blogController.getBlog)
  .patch(auth('manageSalons'), validate(blogValidation.updateBlog), blogController.updateBlog)
  .delete(auth('manageSalons'), validate(blogValidation.getBlog), blogController.deleteBlog);

module.exports = router;
