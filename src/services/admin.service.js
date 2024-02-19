const httpStatus = require('http-status');
const { Admin, User, Beautician } = require('../models');
const ApiError = require('../utils/ApiError');

const createAdmin = async (adminBody) => {
  if (await Admin.isEmailTaken(adminBody.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }

  if (await Admin.isPhoneNoTaken(adminBody.phone)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Phone Number already taken');
  }
  return Admin.create(adminBody);
};

const getAdminById = async (id) => {
  return Admin.findById(id);
};

const getAdminByEmail = async (email) => {
  return Admin.findOne({ email });
};

const updateAdminById = async (adminId, updateBody) => {
  const admin = await getAdminById(adminId);
  if (!admin) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Admin not found', false);
  }
  if (updateBody.email && (await Admin.isEmailTaken(updateBody.email, adminId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  Object.assign(admin, updateBody);
  await admin.save();
  return admin;
};

const deleteAdminById = async (adminId) => {
  const admin = await getAdminById(adminId);
  if (!admin) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Admin not found');
  }
  await admin.remove();
  return admin;
};

const getListOfUsers = async (page = 1, limit = 10) => {
  const users = await User.paginate(
    {},
    {
      page,
      limit,
    }
  );

  return users;
};

const getListOfBeauticians = async (page = 1, limit = 10) => {
  const beauticians = await Beautician.paginate(
    {},
    {
      page,
      limit,
    }
  );
  return beauticians;
};

const getUserDetails = async (userId) => {
  const userDetails = await User.findOne({ _id: userId });
  if (!userDetails) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User details not found');
  }
  console.log(userDetails);
  return userDetails;
};

const getBeauticianDetails = async (beauticianId) => {
  const beauticianDetails = await Beautician.findOne({ _id: beauticianId });
  if (!beauticianDetails) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Beautician details not found');
  }
  return beauticianDetails;
};

module.exports = {
  createAdmin,
  updateAdminById,
  getAdminById,
  getAdminByEmail,
  updateAdminById,
  deleteAdminById,
  getListOfUsers,
  getListOfBeauticians,
  getUserDetails,
  getBeauticianDetails,
};
