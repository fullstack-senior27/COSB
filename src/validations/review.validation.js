const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createReview = {
  body: Joi.object().keys({
    text: Joi.string().required(),
    rating: Joi.number().required(),
    beautician: Joi.required().custom(objectId)
  }),
};

const updateReview = {
  params: Joi.object().keys({
    reviewId: Joi.required().custom(objectId),
  }),
  body: Joi.object().keys({
    text: Joi.string(),
    rating: Joi.array(),
  })
}

module.exports = {
  updateReview,
  createReview
}