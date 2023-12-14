const httpStatus = require("http-status");
const { Promotion } = require("../models");
const ApiError = require("../utils/ApiError");

const createPromotion = async (createBody, beauticianId) => {
  const promotion = await Promotion.create({
    beautician: beauticianId,
    ...createBody
  })

  return promotion;
}

const getPromotionsByBeautician = async (beauticianId) => {
  const promotions = await Promotion.find({
    beautician: beauticianId
  }).sort({ 'createdAt': -1 })
  return promotions;
}

const getPromotionById = async (promotionId) => {
  const promotion = await Promotion.findById(promotionId)
  if (!promotion) {
    throw new ApiError(httpStatus.NOT_FOUND, "Promotion not found", promotion)
  }
  return promotion;
}


module.exports = {
  createPromotion,
  getPromotionsByBeautician,
  getPromotionById
}