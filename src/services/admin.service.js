const httpStatus = require('http-status');
const { Admin } = require('../models');
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

module.exports = {
  createAdmin,
  updateAdminById,
  getAdminById,
  getAdminByEmail,
  updateAdminById,
  deleteAdminById,
};
