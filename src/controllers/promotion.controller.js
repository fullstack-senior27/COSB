const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");
const catchAsync = require("../utils/catchAsync");
const ApiSuccess = require("../utils/ApiSuccess");
const { promotionService } = require("../services");

const createPromotion = catchAsync(async (req, res) => {
  const promotion = await promotionService.createPromotion(req.body, req.user._id);
  if (!promotion) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Promotion could not be created");
  }
  return new ApiSuccess(res, httpStatus.CREATED, "Promotion added successfully!", promotion)
})

const getPromotionsByBeautician = catchAsync(async (req, res) => {
  const promotions = await promotionService.getPromotionsByBeautician(req.query.beauticianId);
  return new ApiSuccess(res, httpStatus.OK, "Promotions fetched successfully", promotions);
})

module.exports = {
  createPromotion,
  getPromotionsByBeautician
}