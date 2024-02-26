const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { authService, tokenService, adminService, otpService, emailService, cmsService } = require('../services');
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

// const forgotPassword = catchAsync(async (req, res) => {
//   console.log(req.body);
//   const resetPasswordToken = await tokenService.generateResetPasswordToken(req.body.email);
//   await emailService.sendResetPasswordEmail(req.body.email, resetPasswordToken);
//   return new ApiSuccess(res, httpStatus.OK, ResponseMessage.RESET_SUCCESS, resetPasswordToken);
// });

const forgotPassword = catchAsync(async (req, res) => {
  const otp = await otpService.generateResetPasswordOtp(req.body.email);
  await emailService.sendResetPasswordEmail(req.body.email, otp);
  return new ApiSuccess(res, httpStatus.OK, 'OTP has been sent to your email ID');
});

// const resetPassword = catchAsync(async (req, res) => {
//   await authService.resetPassword(req.query.token, req.body.password);
//   return new ApiSuccess(res, httpStatus.OK, ResponseMessage.RESET_SUCCESS);
// });
const resetPassword = catchAsync(async (req, res) => {
  const updatedAdmin = await otpService.verifyOtpandResetPassword(req.body.otp, req.body.email, req.body.password);
  return new ApiSuccess(res, httpStatus.OK, 'Password has been reset', updatedAdmin);
});

const listUsers = catchAsync(async (req, res) => {
  const userList = await adminService.getListOfUsers(req.query.page, req.query.limit);
  return new ApiSuccess(res, httpStatus.OK, 'List of users', userList);
});

const listBeauticians = catchAsync(async (req, res) => {
  const beauticianList = await adminService.getListOfBeauticians(req.query.page, req.query.limit);
  return new ApiSuccess(res, httpStatus.OK, 'List of beauticians', beauticianList);
});

const getUserDetails = catchAsync(async (req, res) => {
  const userDetails = await adminService.getUserDetails(req.query.userId);
  return new ApiSuccess(res, httpStatus.OK, 'User details fetched', userDetails);
});

const getBeauticianDetails = catchAsync(async (req, res) => {
  const beauticianDetails = await adminService.getBeauticianDetails(req.query.beauticianId);
  return new ApiSuccess(res, httpStatus.OK, 'Beautician details fetched', beauticianDetails);
});

const getAppointmentListForBeautician = catchAsync(async (req, res) => {
  const appointmentList = await adminService.getAppointmentListForBeautician(
    req.query.beauticianId,
    req.query.page,
    req.query.limit
  );
  return new ApiSuccess(res, httpStatus.OK, 'Appointments list by beautician', appointmentList);
});

const getAppointmentListForUser = catchAsync(async (req, res) => {
  const appointmentList = await adminService.getAppointmentListForUser(req.query.userId, req.query.page, req.query.limit);
  return new ApiSuccess(res, httpStatus.OK, 'Appointments list by user', appointmentList);
});

const getTransactionList = catchAsync(async (req, res) => {
  const transactionList = await adminService.getTransactionList(req.query.beauticianId, req.query.page, req.query.limit);
  return new ApiSuccess(res, httpStatus.OK, 'Transaction list by beautician', transactionList);
});

// CMS
const createHelpContent = catchAsync(async (req, res) => {
  const help = await cmsService.createHelpContent(req.body);
  return new ApiSuccess(res, httpStatus.OK, 'Content added successfully', help);
});

const editHelpContent = catchAsync(async (req, res) => {
  const help = await cmsService.editHelpContent(req.query.id, req.body);
  return new ApiSuccess(res, httpStatus.OK, 'Content edited successfully', help);
});

const deleteHelpContent = catchAsync(async (req, res) => {
  const help = await cmsService.deleteHelpContent(req.query.id);
  return new ApiSuccess(res, httpStatus.OK, 'Content deleted successfully', help);
});

const getHelpContent = catchAsync(async (req, res) => {
  const help = await cmsService.getAllHelpContent();
  return new ApiSuccess(res, httpStatus.OK, 'All help content', help);
});

const getIndividualHelpQuery = catchAsync(async (req, res) => {
  const help = await cmsService.getHelpContentById(req.params.id);
  return new ApiSuccess(res, httpStatus.OK, 'Individual help data', help);
});

const createKnowledgeBaseContent = catchAsync(async (req, res) => {
  const knowledgeBase = await cmsService.createKnowledgeBaseContent(req.body);
  return new ApiSuccess(res, httpStatus.OK, 'Knowledge base created', knowledgeBase);
});

const editKnowledgeBaseContent = catchAsync(async (req, res) => {
  const knowledgeBaseContent = await cmsService.editKnowledgeBaseContent(req.query.id, req.body);
  return new ApiSuccess(res, httpStatus.OK, 'Knowledge base content edited', knowledgeBaseContent);
});

const deleteKnowledgeBaseContent = catchAsync(async (req, res) => {
  const deletedKnowledgeBaseContent = await cmsService.deleteKnowledgeBaseContent(req.query.id);
  return new ApiSuccess(res, httpStatus.OK, 'Knowledge base content deleted successfully', deletedKnowledgeBaseContent);
});

const getAllKnowledgeBaseContent = catchAsync(async (req, res) => {
  const list = await cmsService.getAllKnowledgeBaseContent();
  return new ApiSuccess(res, httpStatus.OK, 'All knowledge base content', list);
});

const getKnowledgeBaseContentById = catchAsync(async (req, res) => {
  const knowledgeBaseContent = await cmsService.getKnowledgeBaseContentById(req.query.id);
  return new ApiSuccess(res, httpStatus.OK, 'Knowledge Base content', knowledgeBaseContent);
});

module.exports = {
  register,
  login,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
  listUsers,
  listBeauticians,
  getUserDetails,
  getBeauticianDetails,
  getAppointmentListForBeautician,
  getAppointmentListForUser,
  getTransactionList,
  createHelpContent,
  editHelpContent,
  deleteHelpContent,
  getHelpContent,
  getIndividualHelpQuery,
  createKnowledgeBaseContent,
  editKnowledgeBaseContent,
  deleteKnowledgeBaseContent,
  getAllKnowledgeBaseContent,
  getKnowledgeBaseContentById,
};
