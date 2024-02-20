const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { blogCategoryService } = require('../services');
const ApiSuccess = require('../utils/ApiSuccess');

const createBlogCategory = catchAsync(async (req, res) => {
  const createdBlogCategory = await blogCategoryService.createBlogCategory(req.body.name);
  return res.status(201).json({
    code: httpStatus.CREATED,
    message: 'Blog Category created successfully!',
    isSuccess: true,
    data: createdBlogCategory,
  });
});

const listBlogCategories = catchAsync(async (req, res) => {
  const blogCategories = await blogCategoryService.listBlogCategories();
  return res.status(200).json({
    code: httpStatus.OK,
    message: 'Blogs fetched successfully',
    isSuccess: true,
    data: blogCategories,
  });
});

const updateBlogCategory = catchAsync(async (req, res) => {
  const blogCategory = await blogCategoryService.updateBlogCategory(req.params.category_id, req.body);
  return new ApiSuccess(res, httpStatus.OK, 'Blog Category updated successfully', blogCategory);
});

const deleteBlogCategory = catchAsync(async (req, res) => {
  const blogCategory = await blogCategoryService.deleteBlogCategory(req.params.category_id);
  return new ApiSuccess(res, httpStatus.OK, 'Blog category deleted successfully');
});

const getBlogCategoryById = catchAsync(async (req, res) => {
  const blogCategory = await blogCategoryService.getBlogCategoryById(req.query.category_id);
  return new ApiSuccess(res, httpStatus.OK, 'Blog category fetched successfully', blogCategory);
});

module.exports = {
  createBlogCategory,
  listBlogCategories,
  updateBlogCategory,
  deleteBlogCategory,
  getBlogCategoryById,
};
