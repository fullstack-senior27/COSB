const httpStatus = require('http-status');
const { Blog, BlogCategory, User, Beautician, Admin } = require('../models');
const ApiError = require('../utils/ApiError');
const mongoose = require('mongoose');
const { adminService, blogService } = require('.');

const getBlogs = async () => {
  // options.populate = "user, blog_category";
  const blogs = await Blog.find().populate('user').populate('blog_category').sort({ createdAt: 'desc' });
  return blogs;
};

const getBlogsByTopic = async (blogCategoryId) => {
  const blogs = await Blog.find({
    blog_category: blogCategoryId,
  })
    .populate('author')
    .populate('blog_category');
  return blogs;
};

const createBlog = async ({ title, description, blog_category, imageUrl }, cur_user) => {
  console.log(cur_user);
  const blog = await Blog.create({
    title,
    description,
    blog_category,
    author: cur_user._id,
    imageUrl,
  });
  return blog;
};

const getBlogById = async (blog_id) => {
  const blog = await Blog.findById(mongoose.Types.ObjectId(blog_id)).populate('user').populate('blog_category');
  return blog;
};

const updateBlog = async (blog_id, updateBody) => {
  const updatedBlog = await Blog.findById(blog_id);
  if (!updateBlog) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Blog does not exist', false);
  }
  Object.assign(updatedBlog, updateBody);
  await updatedBlog.save();
  return updatedBlog;
};

const deleteBlog = async (blog_id) => {
  const deletedBlog = await getBlogById(blog_id);
  if (!deletedBlog) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Blog does not exist', false);
  }
  await deletedBlog.remove();
  // console.log(updatedAdmin);
  console.log(deletedBlog);
  return deletedBlog;
};

const createBlogCategory = async (name) => {
  const blogCategory = await BlogCategory.create({
    name,
  });
  return blogCategory;
};

const getRelatedBlogs = async (blogId) => {
  const blog = await getBlogById(blogId);

  if (blog) {
    const relatedBlogs = await Blog.find({
      blog_category: blog.blog_category,
      _id: { $ne: blogId },
    })
      .populate('blog_category')
      .limit(3);
    return relatedBlogs;
  }
};

module.exports = {
  getBlogs,
  getBlogsByTopic,
  createBlog,
  getBlogById,
  updateBlog,
  deleteBlog,
  createBlogCategory,
  getRelatedBlogs,
};
