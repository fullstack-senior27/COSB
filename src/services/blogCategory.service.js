const httpStatus = require('http-status');
const { BlogCategory } = require('../models');
const ApiError = require('../utils/ApiError');
const mongoose = require('mongoose')

const createBlogCategory = async (name) => {
  const blogCategory = await BlogCategory.create({
    name
  })
  if (!blogCategory) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Bad request', false);
  }
  return blogCategory;
}

const listBlogCategories = async () => {
  const blogCategories = await BlogCategory.find()
  return blogCategories;
}

module.exports = {
  createBlogCategory,
  listBlogCategories
}
