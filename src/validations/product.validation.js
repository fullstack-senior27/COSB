const Joi = require('joi');
const { password, objectId } = require('./custom.validation');

const createProduct = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    description: Joi.string().required(),
    price: Joi.number().required(),
    quantity: Joi.number().required(),
    isAvailable: Joi.boolean(),
  }),
};

const editProduct = {
  params: Joi.object().keys({
    productId: Joi.required().custom(objectId),
  }),
  body: Joi.object().keys({
    name: Joi.string(),
    description: Joi.string(),
    price: Joi.number(),
    quantity: Joi.number(),
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