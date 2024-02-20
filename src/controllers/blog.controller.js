const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { blogService } = require('../services');
const ApiSuccess = require('../utils/ApiSuccess');

const createBlog = catchAsync(async (req, res) => {
  console.log('cur_user: ', req.user);
  const createdBlog = await blogService.createBlog(req.body, req.user);
  return res.status(201).json({
    code: httpStatus.CREATED,
    message: 'Blog created successfully!',
    isSuccess: true,
    data: createdBlog,
  });
});

const getBlogs = catchAsync(async (req, res) => {
  let blogs = [];
  const options = pick(req.query, ['limit', 'page']);
  const page = parseInt(options.page) || 1; // Current page, default to 1 if not provided
  const limit = parseInt(options.limit) || 10;
  if (req.body.blogCategory) {
    blogs = await blogService.getBlogsByTopic(req.body.blogCategory);

    // const skip = (page - 1) * limit;
    // const paginatedBlogs = blogs.slice(skip, skip + limit);
    // return res.status(httpStatus.OK).json({
    //   code: httpStatus.OK,
    //   message: 'Blogs fetched successfully',
    //   isSuccess: true,
    //   data: {
    //     results: paginatedBlogs,
    //     totalPages: Math.ceil(blogs.length / limit),
    //     currentPage: page,
    //     limit: limit,
    //     totalResults: paginatedBlogs.length
    //   }
    // })
  } else {
    blogs = await blogService.getBlogs();
  }
  if (!blogs) {
    throw new ApiError(httpStatus.NOT_FOUND, 'No Blogs found', false);
  }
  const skip = (page - 1) * limit;
  const paginatedBlogs = blogs.slice(skip, skip + limit);
  return res.status(httpStatus.OK).json({
    code: httpStatus.OK,
    message: 'Blogs fetched successfully',
    isSuccess: true,
    data: {
      results: paginatedBlogs,
      totalPages: Math.ceil(blogs.length / limit),
      currentPage: page,
      limit: limit,
      totalResults: paginatedBlogs.length,
    },
  });
});

const getBlog = catchAsync(async (req, res) => {
  const blog_id = req.query.blog_id;
  const blog = await blogService.getBlogById(blog_id);
  if (!blog) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Blog not found', false);
  }
  return new ApiSuccess(res, httpStatus.OK, 'Blogs fetched successfully', blog);
});

const updateBlog = catchAsync(async (req, res) => {
  const blog_id = req.params.blog_id;
  const blog = await blogService.updateBlog(blog_id, req.body);
  return new ApiSuccess(res, httpStatus.OK, 'Blog updated successfully', blog);
});

const deleteBlog = catchAsync(async (req, res) => {
  const blog_id = req.params.blog_id;
  const blog = await blogService.deleteBlog(blog_id);
  return new ApiSuccess(res, httpStatus.NO_CONTENT, 'Blog deleted successfully', blog);
});

const createBlogCategory = catchAsync(async (req, res) => {
  const { name } = req.body;
  const blog_category = await blogService.createBlogCategory(name);
  return new ApiSuccess(res, httpStatus.CREATED, 'Blog category created successfuly', blog_category);
});

const getRelatedBlogs = catchAsync(async (req, res) => {
  const blogs = await blogService.getRelatedBlogs(req.params.blogId);
  return new ApiSuccess(res, httpStatus.OK, 'Related blogs', blogs);
});

module.exports = {
  createBlog,
  getBlogs,
  getBlog,
  updateBlog,
  deleteBlog,
  createBlogCategory,
  getRelatedBlogs,
};
