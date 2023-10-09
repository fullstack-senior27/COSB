const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { salonService } = require('../services');


const getSalons = catchAsync(async (req, res) => {
  console.log(req.body) // filter params in body
  console.log(req.query)
  const filters = pick(req.query, ['name'])
  const options = pick(req.query, ['limit', 'page'])
  const page = parseInt(options.page) || 1; // Current page, default to 1 if not provided
  const limit = parseInt(options.limit) || 10; // Number of items per page, default to 10 if not provided

  // Calculate the skip value based on the page and limit
  const skip = (page - 1) * limit;
  let salons;
  if (req.body.filters) {
    console.log("here")
    salons = await salonService.filterSalons(req.body.filters);
  }
  else {
    salons = await salonService.getAllSalons(filters, options);
  }
  if (!salons) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Salons not found', false)
  }
  const paginatedSalons = salons.slice(skip, skip + limit);
  return res.status(httpStatus.OK).json({
    code: httpStatus.OK,
    message: 'Salons fetched successfully',
    data: {
      salons: paginatedSalons,
      totalPages: Math.ceil(salons.length / limit),
      currentPage: page,
      limit: limit,
      totalResults: paginatedSalons.length
    }
  })
})

const getSingleSalon = catchAsync(async (req, res) => {
  const salonId = req.params.salon_id;
  const salon = await salonService.getSalonById(salonId);
  if (!salon) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Salon not found', false)
  }
  return res.status(httpStatus.OK).json({
    code: httpStatus.OK,
    message: 'Salon fetched successfully',
    isSuccess: true,
    data: salon
  })
})

const createSalon = catchAsync(async (req, res) => {
  const salon = await salonService.createSalon(req.body, req.user._id);
  if (!salon) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid data salon not created', false);
  }
  return res.status(httpStatus.CREATED).json({
    code: httpStatus.CREATED,
    isSuccess: true,
    message: 'Salon created successfully',
    data: salon
  })
})

const giveRating = catchAsync(async (req, res) => {
  console.log(req.params.salon_id)
  console.log(req.body);
  const salon = await salonService.rateSalon(req.params.salon_id, req.user, req.body.rating);
  return res.status(httpStatus.CREATED).json({
    code: httpStatus.CREATED,
    isSuccess: true,
    message: 'Salon rated successfully',
    data: salon
  });
})

const updateSalon = catchAsync(async (req, res) => {
  const updatedSalon = await salonService.updateSalon(req.params.salon_id, req.body, req.user)
  return res.status(httpStatus.CREATED).json({
    code: httpStatus.CREATED,
    isSuccess: true,
    message: 'Salon updated successfully',
    data: updatedSalon
  });
})

const deleteSalon = catchAsync(async (req, res) => {
  const deletedSalon = await salonService.deleteSalon(req.params.salon_id)
  return res.status(httpStatus.NO_CONTENT).json({
    code: httpStatus.NO_CONTENT,
    isSuccess: true,
    message: 'Salon deleted successfully',
    data: deletedSalon
  })
})

const giveReview = catchAsync(async (req, res) => {
  const salon = await salonService.reviewSalon(req.params.salon_id, req.user, req.body.review_text, req.body.rating);
  return res.status(httpStatus.CREATED).json({
    code: httpStatus.CREATED,
    isSuccess: true,
    message: 'Salon rated successfully',
    data: salon
  });
})

module.exports = {
  getSalons,
  createSalon,
  giveRating,
  getSingleSalon,
  updateSalon,
  deleteSalon,
  giveReview
};
