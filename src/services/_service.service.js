const httpStatus = require('http-status');
const { Salon, Service, Category } = require('../models');
const ApiError = require('../utils/ApiError');
const { filter, http } = require('../config/logger');
const mongoose = require('mongoose');

const createService = async ({ name, price, durationInMinutes, category }) => {
  const service = await Service.create({
    name,
    price,
    durationInMinutes,
    service_category: category,
  })
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
