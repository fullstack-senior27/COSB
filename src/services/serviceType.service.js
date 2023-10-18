const httpStatus = require('http-status');
const { ServiceType } = require('../models');
const ApiError = require('../utils/ApiError');
const { filter, http } = require('../config/logger');
const mongoose = require('mongoose');

const createServiceType = async ({ name }) => {
  const existingType = await ServiceType.findOne({ name })
  if (existingType) {
    throw new ApiError(httpStatus.CONFLICT, 'Type already exists');
  }

  const type = await ServiceType.create({
    name,
  })

  console.log(type)
  return type;
}

const getServiceTypeById = async (serviceTypeId) => {
  const type = await ServiceType.findById(serviceTypeId);
  if (!type) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Type not found')
  }
  return type;
}

const updateServiceType = async (serviceTypeId, updateBody) => {
  const type = await getServiceTypeById(serviceTypeId);
  if (!type) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Type not found')
  }
  Object.assign(type, updateBody);
  await type.save()
  return type;
}

const deleteServiceType = async (serviceTypeId) => {
  const type = await getServiceTypeById(serviceTypeId);
  await type.remove();
  return type;
}

const getAllServiceTypes = async () => {
  const types = await ServiceType.find();
  return types;
}

module.exports = {
  createServiceType,
  getServiceTypeById,
  updateServiceType,
  deleteServiceType,
  getAllServiceTypes
};
