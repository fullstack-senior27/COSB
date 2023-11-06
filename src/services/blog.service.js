const httpStatus = require('http-status');
const { Blog, BlogCategory, User, Beautician, Admin } = require('../models');
const ApiError = require('../utils/ApiError');
const mongoose = require('mongoose');
const { adminService, blogService } = require('.');

const getBlogs = async () => {
  // options.populate = "user, blog_category";
  const blogs = await Blog.find().populate('user').populate('blog_category').sort({ createdAt: 'desc' });
  return blogs
}

const getBlogsByTopic = async (blogCategoryId) => {
  const blogs = await Blog.find({
    blog_category: blogCategoryId
  }).populate('user').populate('blog_category');
  return blogs
}

const createBlog = async ({ title, description, blogCategoryId }, cur_user) => {
  console.log(cur_user)
  const blog = await Blog.create({
    title,
    description,
    blog_category: blogCategoryId,
    author: cur_user._id
  })
  return blog;
}

const getBlogById = async (blog_id) => {
  const blog = await Blog.findById(blog_id).populate('user').populate('blog_category');
  return blog;
}

const updateBlog = async (blog_id, updateBody) => {
  const updatedBlog = await getBlogById(blog_id);
  if (!updateBlog) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Blog does not exist', false);
  }
  Object.assign(updatedBlog, updateBody);
  await updatedBlog.save()
  return updatedBlog;
}

const deleteBlog = async (blog_id) => {
  const deletedBlog = await getBlogById(blog_id);
  if (!deletedBlog) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Blog does not exist', false);
  }
  // console.log(deletedBlog)
  // // const updatedAdmin = await adminService.getAdminById(deletedBlog.author);
  // const updatedAdmin = await Admin.findByIdAndUpdate(deletedBlog.author, {
  //   $pull: { blogs: blog_id }
  // }, { new: true })
  await deletedBlog.remove();
  // console.log(updatedAdmin);
  return deletedBlog;
}

const createBlogCategory = async (name) => {
  const blogCategory = await BlogCategory.create({
    name
  })
  return blogCategory;
}

module.exports = {
  getBlogs,
  getBlogsByTopic,
  createBlog,
  getBlogById,
  updateBlog,
  deleteBlog,
  createBlogCategory
}
