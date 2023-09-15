const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');
const mongoose = require('mongoose');

const ResponseMessage = {
  SUCCESS: 'Success!',
  FAIL: 'Fail!',
  SIGNUP_SUCCESS: 'You Have Successfully Registered!',
  LOGIN_SUCCESS: 'You Have Successfully LoggedIn!',
  LOGOUT_SUCCESS: 'You Have Successfully Logout!',
  EMAIL_VERIFY_SUCCESS: 'Email Verified Successfully!',
  GROUP_CREATE_SUCCESS: 'Group Created Successfully!',
  GROUP_FOLLOW_SUCCESS: 'Group Follow Successfully!',
  GROUP_UNFOLLOW_SUCCESS: 'Group Unfollow Successfully!',
  GROUP_ALREADY_FOLLOWED_BY_USER: 'User is already following the group!',
  POST_CREATE_SUCCESS: 'Post Created Successfully!',
  NOT_ALLOW_ADD_POST: 'You are not allowed to add post',
  BEAUTICIAN_CREATE_SUCCESS: 'Beautician Created Successfully!',
  SALON_CREATE_SUCCESS: 'Salon Created Successfully!',
};

const checkValidId = (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid Id');
  }
};

module.exports = { ResponseMessage, checkValidId };
