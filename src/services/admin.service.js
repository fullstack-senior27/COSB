const httpStatus = require('http-status');
const { Admin, User, Beautician, Appointment, Transaction } = require('../models');
const ApiError = require('../utils/ApiError');
const mongoose = require('mongoose');

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

const getAppointmentListForBeautician = async (beauticianId, page, limit) => {
  const appointmentList = await Appointment.paginate(
    { beautician: mongoose.Types.ObjectId(beauticianId) },
    {
      populate: ['services', 'user'],
      page,
      limit,
    }
  );
  return appointmentList;
};

const getAppointmentListForUser = async (userId, page, limit) => {
  const appointmentList = await Appointment.paginate(
    {
      user: mongoose.Types.ObjectId(userId),
    },
    {
      populate: ['service', 'beautician'],
      page,
      limit,
    }
  );
  return appointmentList;
};

const getTransactionList = async (beauticianId, page, limit) => {
  const appointmentList = await Transaction.paginate(
    { beautician: mongoose.Types.ObjectId(beauticianId) },
    {
      populate: ['appointment', 'beautician'],
      page,
      limit,
    }
  );
  return appointmentList;
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
  getAppointmentListForBeautician,
  getAppointmentListForUser,
  getTransactionList,
};
