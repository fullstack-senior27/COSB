const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { blogController, blogCategoryController } = require('../../controllers');
const { blogValidation } = require('../../validations');

const router = express.Router();

router
  .route("").post(blogController.getBlogs)
router
  .route("/:blog_id").get(validate(blogValidation.getBlog), blogController.getBlog)


router
  .route("/categories/all")
  .get(blogCategoryController.listBlogCategories)

module.exports = router;
