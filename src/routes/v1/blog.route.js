const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { blogController, blogCategoryController } = require('../../controllers');
const { blogValidation } = require('../../validations');

const router = express.Router();

router.route('').post(blogController.getBlogs);
router.route('/get-blog').get(blogController.getBlog);

router.route('/related/:blogId').get(blogController.getRelatedBlogs);

router.route('/categories/all').get(blogCategoryController.listBlogCategories);

router.route('/categories/get-category').get(blogCategoryController.getBlogCategoryById);

module.exports = router;
