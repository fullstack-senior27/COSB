const Joi = require('joi');
const { password, objectId } = require('./custom.validation');

const createProduct = {
  body: Joi.object().keys({
    title: Joi.string().required(),
    description: Joi.string(),
    link: Joi.string(),
    isAvailable: Joi.boolean(),
    beautician: Joi.string().custom(objectId)
  }),
};

const editProduct = {
  params: Joi.object().keys({
    productId: Joi.required().custom(objectId),
  }),
  body: Joi.object().keys({
    title: Joi.string(),
    description: Joi.string(),
    link: Joi.number(),
    isAvailable: Joi.boolean(),
  }),
}

const deleteProduct = {
  params: Joi.object().keys({
    productId: Joi.required().custom(objectId),
  }),
}

const getProductDetails = {
  params: Joi.object().keys({
    productId: Joi.required().custom(objectId),
  }),
}

module.exports = {
  createProduct,
  editProduct,
  deleteProduct,
  getProductDetails
}