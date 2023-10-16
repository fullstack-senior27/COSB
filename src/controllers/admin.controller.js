const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { authService, tokenService, adminService } = require('../services');
const ApiSuccess = require('../utils/ApiSuccess');
const { ResponseMessage } = require('../utils/comman');

const register = catchAsync(async (req, res) => {
  const admin = await adminService.createAdmin(req.body);
  const tokens = await tokenService.generateAuthTokens(admin);
  return new ApiSuccess(res, httpStatus.CREATED, ResponseMessage.SIGNUP_SUCCESS, admin, tokens);
});

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const admin = await authService.adminLogin(email, password);
  const tokens = await tokenService.generateAuthTokens(admin);
  // res.send({ user, tokens });
  return new ApiSuccess(res, httpStatus.OK, ResponseMessage.LOGIN_SUCCESS, admin, tokens);
});

const logout = catchAsync(async (req, res) => {
  await authService.adminLogout(req.body.refreshToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const refreshTokens = catchAsync(async (req, res) => {
  const tokens = await authService.adminRefreshAuth(req.body.refreshToken);
  res.send({ ...tokens });
});

const forgotPassword = catchAsync(async (req, res) => {
  console.log(req.body);
  const resetPasswordToken = await tokenService.generateResetPasswordToken(req.body.email);
  await emailService.sendResetPasswordEmail(req.body.email, resetPasswordToken);
  return new ApiSuccess(res, httpStatus.OK, ResponseMessage.RESET_SUCCESS, resetPasswordToken)
});

const resetPassword = catchAsync(async (req, res) => {
  await authService.resetPassword(req.query.token, req.body.password);
  return new ApiSuccess(res, httpStatus.OK, ResponseMessage.RESET_SUCCESS);
});


module.exports = {
  register,
  login,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
};
