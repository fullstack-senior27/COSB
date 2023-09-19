const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const ApiSuccess = require('../utils/ApiSuccess');
const { ResponseMessage, checkValidId } = require('../utils/comman');
const { beauticianService } = require('../services');
const { Salon, Service } = require('../models');

const createBeautician = catchAsync(async (req, res) => {
  const beautician = await beauticianService.createBeautician(req.body);
  const message = 'Login Successfully!';

  // res.status(httpStatus.CREATED).send(Beautician);
  new ApiSuccess(res, httpStatus.OK, ResponseMessage.BEAUTICIAN_CREATE_SUCCESS, beautician);
});

// Beautician
const getAllBeautician = catchAsync(async (req, res) => {
  const beautician = await beauticianService.getBeautician();

  // console.log(beautician);
  new ApiSuccess(res, httpStatus.OK, ResponseMessage.OK, beautician);
});

const getBeautician = catchAsync(async (req, res) => {
  checkValidId(req.params.id);
  const beautician = await beauticianService.getBeauticianById(req.params.id);
  // const salon = await beauticianService.getSalonByBeauticianId(req.params.id);

  new ApiSuccess(res, httpStatus.OK, ResponseMessage.OK, beautician[0]);
});

const createSalon = catchAsync(async (req, res) => {
  checkValidId(req.body.beautician);

  const salon = await beauticianService.createSalon(req.body);
  new ApiSuccess(res, httpStatus.OK, ResponseMessage.SALON_CREATE_SUCCESS, salon);
});

const getAllSalon = catchAsync(async (req, res) => {
  const salon = await beauticianService.getsalon(req.body);

  new ApiSuccess(res, httpStatus.OK, ResponseMessage.SUCCESS, salon);
});

const createService = catchAsync(async (req, res) => {
  checkValidId(req.body.beautician);

  const salon = await beauticianService.createSalon(req.body);
  new ApiSuccess(res, httpStatus.OK, ResponseMessage.SERVICE_CREATE_SUCCESS, salon);
});

const getAllService = catchAsync(async (req, res) => {
  const salon = await beauticianService.getservice();

  new ApiSuccess(res, httpStatus.OK, ResponseMessage.SUCCESS, salon);
});

const getSalonById = catchAsync(async (req, res) => {
  checkValidId(req.params.id);

  const salon = await beauticianService.getSalonById(req.params.id);

  new ApiSuccess(res, httpStatus.OK, ResponseMessage.SUCCESS, salon[0]);
});

const search = catchAsync(async (req, res) => {
  const searchData = await beauticianService.seachServiceSalaon(req.body);

  new ApiSuccess(res, httpStatus.OK, ResponseMessage.SUCCESS, searchData);
});

// service type
const createServiceType = catchAsync(async (req, res) => {
  const ServiceType = await beauticianService.createServiceType(req.body);
  new ApiSuccess(res, httpStatus.OK, ResponseMessage.SERVICE_TYPE_CREATE_SUCCESS, ServiceType);
});

// rating
const createRating = catchAsync(async (req, res) => {
  checkValidId(req.body.user);
  checkValidId(req.body.salon);

  const rating = await beauticianService.createSalonRating(req.body);
  new ApiSuccess(res, httpStatus.OK, ResponseMessage.RATING_CREATE_SUCCESS, rating);
});

// rating
const getAllSalonByBeautician = catchAsync(async (req, res) => {
  checkValidId(req.params.id);

  const rating = await beauticianService.getSalonByBeautician(req.params.id);
  new ApiSuccess(res, httpStatus.OK, ResponseMessage.SALON_FETCHED_SUCCESS, rating);
});

const getServiceBySalon = catchAsync(async (req, res) => {
  checkValidId(req.params.id);

  const rating = await beauticianService.getServiceBySalon(req.params.id);
  new ApiSuccess(res, httpStatus.OK, ResponseMessage.SALON_FETCHED_SUCCESS, rating);
});

// test

const test = catchAsync(async (req, res) => {

  const rating = await beauticianService.testService(req);

  new ApiSuccess(res, httpStatus.OK, ResponseMessage.SALON_FETCHED_SUCCESS, rating);
});

module.exports = {
  createBeautician,
  getAllBeautician,
  createSalon,
  getAllSalon,
  createService,
  getAllService,
  getSalonById,
  search,
  createServiceType,
  getBeautician,
  getBeautician,
  createRating,
  getAllSalonByBeautician,
  getServiceBySalon,
  test,
};
