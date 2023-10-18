const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { userService, appointmentService } = require('../services');
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
  const user = await userService.updateUserById(req.params.userId, req.body);
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

const getAppointmentsByUserId = catchAsync(async (req, res) => {
  const appointments = await appointmentService.getAppointmentsByUserId(req.user._id);
  const options = pick(req.query, ['limit', 'page'])
  const page = parseInt(options.page) || 1; // Current page, default to 1 if not provided
  const limit = parseInt(options.limit) || 10;
  const skip = (page - 1) * limit;
  const paginatedAppointments = appointments.slice(skip, skip + limit);
  return res.status(httpStatus.OK).json({
    code: httpStatus.OK,
    message: 'Appointments fetched successfully',
    isSuccess: true,
    data: {
      results: paginatedAppointments,
      totalPages: Math.ceil(appointments.length / limit),
      currentPage: page,
      limit: limit,
      totalResults: paginatedAppointments.length
    }
  })
})

module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  getProfile,
  getAppointmentsByUserId
};
