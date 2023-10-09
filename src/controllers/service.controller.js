const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { _service } = require('../services');


const createService = catchAsync(async (req, res) => {
  console.log(req.body)
  const createdService = await _service.createService(req.body)
  return res.status(201).json({
    code: httpStatus.CREATED,
    message: "Service created successfully!",
    isSuccess: true,
    data: createdService
  })
})

const getService = catchAsync(async (req, res) => {
  const service = await _service.getServiceById(req.params.service_id)
  if (!service) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Service not found', false)
  }
  return res.status(httpStatus.OK).json({
    code: httpStatus.OK,
    message: 'Service fetched successfully',
    isSuccess: true,
    data: service
  })
})

const getAllServices = catchAsync(async (req, res) => {
  const services = await _service.getAllServices()
  if (!services) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Services not found', false)
  }
  // return res.status(httpStatus.OK).json({
  //   code: httpStatus.OK,
  //   messsage: 'Services fetched successfully',
  //   isSuccess: true,
  //   data: services
  // })
  const options = pick(req.query, ['sortBy', 'limit', 'page'])
  const page = parseInt(options.page) || 1; // Current page, default to 1 if not provided
  const limit = parseInt(options.limit) || 10; // Number of items per page, default to 10 if not provided

  // Calculate the skip value based on the page and limit
  const skip = (page - 1) * limit;
  if (!services) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Services not found', false)
  }
  const paginatedServices = services.slice(skip, skip + limit);
  return res.status(httpStatus.OK).json({
    code: httpStatus.OK,
    message: 'Services fetched successfully',
    data: {
      results: paginatedServices,
      totalPages: Math.ceil(services.length / limit),
      currentPage: page,
      limit: limit,
      totalResults: paginatedServices.length
    }
  })
})

const updateService = catchAsync(async (req, res) => {
  const updatedService = await _service.updateService(req.params.service_id, req.body)
  if (!updatedService) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Service not found', false)
  }
  return res.status(httpStatus.CREATED).json({
    code: httpStatus.CREATED,
    messsage: 'Service updated successfully',
    isSuccess: true,
    data: updatedService
  })
})

const deleteService = catchAsync(async (req, res) => {
  const deletedService = await _service.deleteService(req.params.service_id)
  if (!deletedService) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Service not found', false)
  }
  return res.status(httpStatus.NO_CONTENT).json({
    code: httpStatus.NO_CONTENT,
    messsage: 'Service deleted successfully',
    isSuccess: true,
    data: deletedService
  })
})


module.exports = {
  createService,
  getService,
  getAllServices,
  updateService,
  deleteService
};
