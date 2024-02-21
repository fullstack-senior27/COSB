const httpStatus = require('http-status');
const { User, userService } = require('../user');
const ApiError = require('../utils/ApiError');

function generateOTP() {
  const otp = Math.floor(1000 + Math.random() * 9000);
  return otp.toString();
}

const generateResetPasswordOtp = async (email) => {
  const otp = generateOTP();
  const otpGenerationTime = new Date();
  // add this otp to user model
  const user = await User.findOne({ email });
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
  const user = await User.findOne({ email });
  if (!user.otp || user.otp !== enteredOtp || !isOtpValidTime(user)) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'OTP is invalid');
  }
  await userService.updateUserById(user.id, { password: newPassword });
  user.otp = '';
  //   user.otpGeneratedAt = undefined;
  await user.save();
  return user;
};

module.exports = {
  generateResetPasswordOtp,
  verifyOtpandResetPassword,
};
