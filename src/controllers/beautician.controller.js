const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { beauticianService, authService, tokenService, _service, reviewService, emailService } = require('../services');
const ApiSuccess = require('../utils/ApiSuccess');
const { ResponseMessage } = require('../utils/comman');

const register = catchAsync(async (req, res) => {
  const user = await beauticianService.createBeautician(req.body);
  const tokens = await tokenService.generateAuthTokens(user);
  return new ApiSuccess(res, httpStatus.CREATED, ResponseMessage.SIGNUP_SUCCESS, user, tokens);
});

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const user = await authService.beauticianLogin(email, password);
  const tokens = await tokenService.generateAuthTokens(user);
  // res.send({ user, tokens });
  return new ApiSuccess(res, httpStatus.OK, ResponseMessage.LOGIN_SUCCESS, user, tokens);
});

const logout = catchAsync(async (req, res) => {
  await authService.beauticianLogout(req.body.refreshToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const refreshTokens = catchAsync(async (req, res) => {
  const tokens = await authService.beauticianRefreshAuth(req.body.refreshToken);
  res.send({ ...tokens });
});

const forgotPassword = catchAsync(async (req, res) => {
  console.log(req.body);
  const resetPasswordToken = await tokenService.generateResetPasswordTokenBeautician(req.body.email);
  await emailService.sendResetPasswordEmail(req.body.email, resetPasswordToken);
  return new ApiSuccess(res, httpStatus.OK, ResponseMessage.RESET_SUCCESS, resetPasswordToken);
});

const resetPassword = catchAsync(async (req, res) => {
  await authService.resetPassword(req.query.token, req.body.password);
  return new ApiSuccess(res, httpStatus.OK, ResponseMessage.RESET_SUCCESS);
});

const sendVerificationEmail = catchAsync(async (req, res) => {
  const verifyEmailToken = await tokenService.generateVerifyEmailToken(req.user);
  await emailService.sendVerificationEmail(req.user.email, verifyEmailToken);
  return new ApiSuccess(res, httpStatus.OK, 'success', verifyEmailToken);
});

const verifyEmail = catchAsync(async (req, res) => {
  await authService.verifyBeauticianEmail(req.query.token);
  res.status(httpStatus.NO_CONTENT).send();
});

const getProfile = catchAsync(async (req, res) => {
  const beautician = await beauticianService.getBeauticianDetails(req.body.beauticianId);
  // console.log("beautician: ", beautician);
  if (!beautician) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  return new ApiSuccess(res, httpStatus.OK, 'User found successfully', beautician);
});

const updateBeautician = catchAsync(async (req, res) => {
  const user = await beauticianService.updateBeauticianById(req.user._id, req.body);
  return new ApiSuccess(res, httpStatus.OK, 'User updated successfully', user);
});

const deleteBeautician = catchAsync(async (req, res) => {
  await beauticianService.deleteBeauticianById(req.user._id);
  return new ApiSuccess(res, httpStatus.NO_CONTENT, 'User deleted successfully');
});

const getBeauticians = catchAsync(async (req, res) => {
  let beauticians;
  const options = pick(req.query, ['limit', 'page']);
  const page = parseInt(options.page) || 1; // Current page, default to 1 if not provided
  const limit = parseInt(options.limit) || 10;
  const skip = (page - 1) * limit;
  if (req.body.filters) {
    const { search, location, date, price_range, service_type, sort_price, avgRating } = req.body.filters;
    beauticians = await beauticianService.filterBeauticians(req.body.filters);
  } else {
    beauticians = await beauticianService.getAllBeauticians();
  }
  const paginatedBeauticians = beauticians.slice(skip, skip + limit);
  return res.status(httpStatus.OK).json({
    code: httpStatus.OK,
    message: 'Beauticians fetched successfully',
    isSuccess: true,
    data: {
      results: paginatedBeauticians,
      totalPages: Math.ceil(beauticians.length / limit),
      currentPage: page,
      limit: limit,
      totalResults: paginatedBeauticians.length,
    },
  });
});

const getAllReviewsByBeauticianId = catchAsync(async (req, res) => {
  const reviews = await reviewService.getAllReviewsByBeauticianId(req.body.beauticianId);
  return new ApiSuccess(res, httpStatus.OK, 'Successfull', reviews);
});

module.exports = {
  register,
  login,
  logout,
  refreshTokens,
  forgotPassword,
  getProfile,
  resetPassword,
  updateBeautician,
  sendVerificationEmail,
  verifyEmail,
  deleteBeautician,
  getBeauticians,
  getAllReviewsByBeauticianId,
};
