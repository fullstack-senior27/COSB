const httpStatus = require('http-status');
const { Salon, Service, Category, ServiceType, Beautician } = require('../models');
const ApiError = require('../utils/ApiError');
const { filter, http } = require('../config/logger');
const mongoose = require('mongoose');
const { beauticianService } = require('./index');

const createService = async ({ name, price, description, durationInMinutes, category, serviceType }, cur_user) => {
  const service = await Service.create({
    name,
    price,
    description,
    durationInMinutes,
    service_category: category,
    service_type: serviceType,
    beautician: cur_user._id
  })

  const updatedType = await ServiceType.findById(serviceType);
  updatedType.services.push(service);
  await updatedType.save();
  const beautician = await Beautician.findById(cur_user._id);
  beautician.services.push(service._id);
  await beautician.save();
  return service;
}

const getServiceById = async (service_id) => {
  const service = await Service.findById(service_id).populate('service_category')
  return service;
}

const getAllServices = async () => {
  const allServices = await Service.find().populate('service_category')

  return allServices;
}

const updateService = async (service_id, updateBody) => {
  const updatedService = await getServiceById(service_id)
  if (!updatedService) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Service not found', false)
  }
  Object.assign(updatedService, updateBody)
  await updatedService.save()
  return updatedService;
}

const deleteService = async (service_id) => {
  const deletedService = await Service.findByIdAndDelete(service_id)
  return deletedService;
}

module.exports = {
  createService,
  getServiceById,
  getAllServices,
  updateService,
  deleteService
};
