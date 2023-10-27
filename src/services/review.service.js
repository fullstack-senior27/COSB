const beauticianService = require('./beautician.service')
const { Review } = require("../models")

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

module.exports = {
  createReview
}