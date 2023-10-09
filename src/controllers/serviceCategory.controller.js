const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { serviceCategoryService } = require('../services');

const createCategory = catchAsync(async (req, res) => {
  console.log(req.body)
  const createdCategory = await serviceCategoryService.createCategory(req.body)
  return res.status(201).json({
    code: 201,
    message: "Category created successfully!",
    isSuccess: true,
    data: createdCategory
  })
})

const deleteCategory = catchAsync(async (req, res) => {
  const deletedCategory = await serviceCategoryService.deleteCategoryById(req.params.category_id);
  if (!deletedCategory) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Category not found', false)
  }
  return res.status(httpStatus.NO_CONTENT).json({
    code: httpStatus.NO_CONTENT,
    message: "Category deleted successfully",
    isSuccess: true,
    data: deletedCategory
  })
})

const getCategory = catchAsync(async (req, res) => {
  const category = await serviceCategoryService.getCategoryById(req.params.category_id);
  if (!category) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Category does not exist', false)
  }
  return res.status(httpStatus.OK).json({
    code: httpStatus.OK,
    message: "Category fetched successfully",
    isSuccess: true,
    data: category
  })
})

const getAllCategories = catchAsync(async (req, res) => {
  const categories = await serviceCategoryService.getAllCategories();
  if (!categories) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Categories not found', false)
  }
  return res.status(httpStatus.OK).json({
    code: httpStatus.OK,
    message: "Categories fetched successfully",
    isSuccess: true,
    data: categories
  })
})

const updateCategory = catchAsync(async (req, res) => {
  const updatedCategory = await serviceCategoryService.updateCategory(req.params.category_id, req.body)
  if (!updatedCategory) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Category not found', false)
  }
  return res.status(httpStatus.CREATED).json({
    code: httpStatus.CREATED,
    message: "Category updated successfully",
    isSuccess: true,
    data: updatedCategory
  })
})

module.exports = {
  createCategory,
  deleteCategory,
  getCategory,
  getAllCategories,
  updateCategory
};
