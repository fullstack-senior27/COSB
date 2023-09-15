const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const ApiSuccess = require('../utils/ApiSuccess');
const { ResponseMessage, checkValidId } = require('../utils/comman');
const { beauticianService } = require('../services');
const { Salon } = require('../models');

const createBeautician = catchAsync(async (req, res) => {
  const beautician = await beauticianService.createBeautician(req.body);
  const message = 'Login Successfully!';

  // res.status(httpStatus.CREATED).send(Beautician);
  new ApiSuccess(res, httpStatus.OK, ResponseMessage.BEAUTICIAN_CREATE_SUCCESS, beautician);
});

const getAllBeautician = catchAsync(async (req, res) => {
  const beautician = await beauticianService.getBeautician();

  // console.log(beautician);
  new ApiSuccess(res, httpStatus.OK, ResponseMessage.OK, beautician);
});

const createSalon = catchAsync(async (req, res) => {
  checkValidId(req.body.beautician_id);

  const salon = await beauticianService.createSalon(req.body);
  new ApiSuccess(res, httpStatus.OK, ResponseMessage.SALON_CREATE_SUCCESS, salon);
});

const getAllSalon = catchAsync(async (req, res) => {
  const salon = await beauticianService.getsalon();

  new ApiSuccess(res, httpStatus.OK, ResponseMessage.SUCCESS, salon);
});

const createService = catchAsync(async (req, res) => {
  checkValidId(req.body.beautician_id);

  const salon = await beauticianService.createSalon(req.body);
  new ApiSuccess(res, httpStatus.OK, ResponseMessage.SALON_CREATE_SUCCESS, salon);
});

const getAllService = catchAsync(async (req, res) => {
  const salon = await beauticianService.getservice();

  new ApiSuccess(res, httpStatus.OK, ResponseMessage.SUCCESS, salon);
});

const getSalonById = catchAsync(async (req, res) => {

  checkValidId(req.params.id);

  const salon = await beauticianService.getSalonById(req.params.id);

  new ApiSuccess(res, httpStatus.OK, ResponseMessage.SUCCESS, salon);
});

const search=catchAsync(async(req,res)=>{

  const searchData = await beauticianService.seachServiceSalaon(req.body);

  new ApiSuccess(res, httpStatus.OK, ResponseMessage.SUCCESS, searchData);

})

module.exports = {
  createBeautician,
  getAllBeautician,
  createSalon,
  getAllSalon,
  createService,
  getAllService,
  getSalonById,
  search
};
