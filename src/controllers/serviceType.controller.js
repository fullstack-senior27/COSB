const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { serviceTypeService } = require('../services');
const ApiSuccess = require('../utils/ApiSuccess');

const createServiceType = catchAsync(async (req, res) => {
  console.log(req.body)
  const createdType = await serviceTypeService.createServiceType(req.body)
  return res.status(201).json({
    code: 201,
    message: "Service type created successfully!",
    isSuccess: true,
    data: createdType
  })
})

const getAllServiceTypes = catchAsync(async (req, res) => {
  const types = await serviceTypeService.getAllServiceTypes()
  return new ApiSuccess(res, httpStatus.OK, "Service types fetched successfully", types);
})

const updateServiceType = catchAsync(async (req, res) => {
  const serviceTypeId = req.params.serviceTypeId
  const type = await serviceTypeService.updateServiceType(serviceTypeId, req.body);
  return new ApiSuccess(res, httpStatus.OK, "Service Type updated successfully", type);
})

const deleteServiceType = catchAsync(async (req, res) => {
  const serviceTypeId = req.params.serviceTypeId;
  const type = await serviceTypeService.deleteServiceType(serviceTypeId);
  return new ApiSuccess(res, httpStatus.NO_CONTENT, "Service Type deleted successfully")
})

module.exports = {
  createServiceType,
  getAllServiceTypes,
  updateServiceType,
  deleteServiceType
};
