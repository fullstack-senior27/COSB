const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { userService, appointmentService, reviewService } = require('../services');
const ApiSuccess = require('../utils/ApiSuccess');

const createUser = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);
  res.status(httpStatus.CREATED).send(user);
});

const getUsers = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'role']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await userService.queryUsers(filter, options);
  res.send(result);
});

const getUser = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.params.userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  res.send(user);
});

const updateUser = catchAsync(async (req, res) => {
  const user = await userService.updateUserById(req.user._id, req.body);
  res.send(user);
});

const deleteUser = catchAsync(async (req, res) => {
  await userService.deleteUserById(req.params.userId);
  res.status(httpStatus.NO_CONTENT).send();
});

const getProfile = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.user._id);
  return new ApiSuccess(res, httpStatus.OK, "Profile fetched successfully", user);
})

const reviewBeautician = catchAsync(async (req, res) => {
  const beautician = await reviewService.createReview(req.body, req.user._id);
  return new ApiSuccess(res, httpStatus.OK, "Review added successfully", beautician)
})

const updateReview = catchAsync(async (req, res) => {
  const review = await reviewService.updateReview(req.body, req.params.reviewId, req.user._id);
  return new ApiSuccess(res, httpStatus.OK, "Review updated successfully", review);
})

const changePassword = catchAsync(async (req, res) => {
  const updatedUser = await userService.changePassword(req.body.oldPassword, req.body.newPassword, req.user._id);
  return new ApiSuccess(res, httpStatus.OK, "Password changed successfully", updatedUser);
})

module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  getProfile,
  reviewBeautician,
  updateReview,
  changePassword
};
