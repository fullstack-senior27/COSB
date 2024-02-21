const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { Admin } = require('../models');
const { adminService } = require('.');

function generateOTP() {
  const otp = Math.floor(1000 + Math.random() * 9000);
  return otp.toString();
}

const generateResetPasswordOtp = async (email) => {
  const otp = generateOTP();
  const otpGenerationTime = new Date();
  // add this otp to user model
  const user = await Admin.findOne({ email });
  user.otp = otp;
  user.otpGeneratedAt = otpGenerationTime;
  await user.save();
  return otp;
};

function isOtpValidTime(user) {
  const now = new Date();
  if (!user.otpGeneratedAt) {
    return false;
  }
  const timeElapsed = (now - user.otpGeneratedAt) / 1000; // Time difference in seconds
  console.log('time diff: ', timeElapsed);
  return timeElapsed <= 300; // 180 seconds = 3 minutes
}

const verifyOtpandResetPassword = async (enteredOtp, email, newPassword) => {
  const user = await Admin.findOne({ email });
  if (!user.otp || user.otp !== enteredOtp || !isOtpValidTime(user)) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'OTP is invalid');
  }
  await adminService.updateAdminById(user.id, { password: newPassword });
  user.otp = '';
  //   user.otpGeneratedAt = undefined;
  await user.save();
  return user;
};

module.exports = {
  generateResetPasswordOtp,
  verifyOtpandResetPassword,
};
