const httpStatus = require('http-status');
const { BlogCategory } = require('../models');
const ApiError = require('../utils/ApiError');
const mongoose = require('mongoose');

const createBlogCategory = async (name) => {
  const blogCategory = await BlogCategory.create({
    name,
  });
  return blogCategory;
};

const listBlogCategories = async () => {
  const blogCategories = await BlogCategory.find();
  return blogCategories;
};

const updateBlogCategory = async (category_id, updateBody) => {
  const blogCategory = await BlogCategory.findById(category_id);
  Object.assign(blogCategory, updateBody);
  await blogCategory.save();
  return blogCategory;
};

const deleteBlogCategory = async (category_id) => {
  const blogCategory = await BlogCategory.findById(category_id);
  await blogCategory.remove();
  return blogCategory;
};

const getBlogCategoryById = async (category_id) => {
  const blogCategory = await BlogCategory.findOne({ _id: mongoose.Types.ObjectId(category_id) });
  if (!blogCategory) {
    throw new ApiError(httpStatus.NOT_FOUND, 'blog category not found');
  }
  return blogCategory;
};

module.exports = {
  createBlogCategory,
  listBlogCategories,
  updateBlogCategory,
  deleteBlogCategory,
  getBlogCategoryById,
};
