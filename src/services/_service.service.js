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
  const beautician = await Beautician.findById(cur_user._id);
  console.log("beautician: ", beautician);
  beautician.services?.push(service._id);
  if (!beautician.service_categories.includes(category)) {
    beautician.service_categories.push(category);
  }
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

const deleteService = async (service_id, cur_user) => {
  const beautician = await Beautician.findById(cur_user._id)
  beautician.services = beautician.services.filter(s => s._id != service_id);
  await beautician.save();
  const deletedService = await Service.findByIdAndDelete(service_id)
  console.log(beautician)
  return deletedService;
}

const getServicesByBeauticianId = async (beautician_id) => {
  const services = await Service.find({
    beautician: beautician_id
  }).populate('service_category')
  return services;
}

const filterServices = async (filters, beauticianId) => {
  // const matchConditions = [

  // ]
  // if(filters.tags) {
  //   matchConditions.push(
  //     {
  //       $or: [
  //         {
  //           'service_type': { $regex: `${filters.tag}`, $options: 'i' }
  //         },
  //         {
  //           'service_category': { $regex: `${filters.tag}`, $options: 'i' }
  //         }
  //       ]
  //     },
  //   )
  // }
  // const aggregationPipeline = [
  //   {
  //     $lookup: {
  //       from: 'service_types',
  //       localField: 'service_type',
  //       foreignField: '_id',
  //       as: 'service_type'
  //     }
  //   },
  //   {
  //     $unwind: "$service_type"
  //   },
  //   {
  //     $lookup: {
  //       from: 'service_categories',
  //       localField: 'service_category',
  //       foreignField: '_id',
  //       as: 'service_category'
  //     }
  //   },
  //   {
  //     $unwind: "$service_category"
  //   },
  //   // {
  //   //   $sort: {
  //   //     "price": filters.sort_price === 'desc' ? -1 : 1
  //   //   }
  //   // },
  //   {
  //     $match: {
  //       "beautician": beauticianId
  //     }
  //   }
  // ]

  const services = await Service.find({
    beautician: beauticianId
  }).sort({ price: filters.sort_price }).populate('service_type').populate('service_category')
  return services;
}

module.exports = {
  createService,
  getServiceById,
  getAllServices,
  updateService,
  deleteService,
  getServicesByBeauticianId,
  filterServices
};
