const beauticianService = require('./beautician.service')
const { Review } = require("../models");
const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');

const createReview = async ({ beautician, text, rating }, userId) => {

  const review = await Review.create({
    beautician,
    text,
    rating,
    user: userId
  })

  const foundBeautician = await beauticianService.getBeauticianById(beautician);
  foundBeautician.reviews.push(review);
  await foundBeautician.save()
  return foundBeautician;
}

const updateReview = async (updateBody, reviewId, userId) => {
  const review = await Review.findById(reviewId)
  console.log(typeof review.user)
  console.log(typeof userId)
  if (review.user.toString().localeCompare(userId.toString()) !== 0) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "You cannot perform this action")
  }
  Object.assign(review, updateBody)
  await review.save();
  return review
}

const getAllReviewsByBeauticianId = async (beauticianId) => {
  const reviews = await Review.find({
    beautician: beauticianId
  }).sort({ createdAt: 'desc' }).populate('user')

  return reviews
}

module.exports = {
  createReview,
  updateReview,
  getAllReviewsByBeauticianId
}