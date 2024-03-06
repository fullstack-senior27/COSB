const httpStatus = require('http-status');
const { ServiceCategory } = require('../models');
const ApiError = require('../utils/ApiError');
const { filter, http } = require('../config/logger');
const mongoose = require('mongoose');

const createCategory = async ({ name, imageUrl }) => {
  const existingCategory = await ServiceCategory.findOne({ name });
  if (existingCategory) {
    throw new ApiError(httpStatus.CONFLICT, 'Category already exists');
  }

  const category = await ServiceCategory.create({
    name,
    imageUrl,
  });

  return category;
};

const deleteCategoryById = async (category_id) => {
  const deletedCategory = await ServiceCategory.findByIdAndDelete(category_id);
  return deletedCategory;
};

const getCategoryById = async (category_id) => {
  const category = await ServiceCategory.findById(category_id);
  return category;
};
const getAllCategories = async () => {
  const categories = await ServiceCategory.find();
  console.log(categories);
  return categories;
};

const updateCategory = async (category_id, updateBody) => {
  const updatedCategory = await getCategoryById(category_id);
  if (!updatedCategory) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Category not found', false);
  }
  Object.assign(updatedCategory, updateBody);
  console.log(updatedCategory);
  updatedCategory.save();
  return updatedCategory;
};

module.exports = {
  createCategory,
  deleteCategoryById,
  getCategoryById,
  getAllCategories,
  updateCategory,
};
