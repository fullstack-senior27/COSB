const Joi = require('joi');
const { password, objectId } = require('./custom.validation');

const createServiceType = {
  body: Joi.object().keys({
    name: Joi.string().required()
  }),
};

const updateServiceType = {
  params: Joi.object().keys({
    serviceTypeId: Joi.required().custom(objectId),
  }),
  body: Joi.object().keys({
    name: Joi.string().required()
  }),
}

const deleteServiceType = {
  params: Joi.object().keys({
    serviceTypeId: Joi.required().custom(objectId),
  }),
}

const getServicesByBeautician = {
  body: Joi.object().keys({
    beauticianId: Joi.string().required().custom(objectId)
  }),
}

const createService = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    price: Joi.number().required(),
    description: Joi.string().required(),
    durationInMinutes: Joi.number().required(),
    category: Joi.required().custom(objectId),
    serviceType: Joi.required().custom(objectId)
  }),
}

const updateService = {
  params: Joi.object().keys({
    service_id: Joi.required().custom(objectId),
  }),
  body: Joi.object().keys({
    name: Joi.string(),
    price: Joi.number(),
    description: Joi.string(),
    durationInMinutes: Joi.number(),
    service_category: Joi.custom(objectId),
    service_type: Joi.custom(objectId)
  }),
}

const deleteService = {
  params: Joi.object().keys({
    service_id: Joi.required().custom(objectId),
  }),
}

const createServiceCategory = {
  body: Joi.object().keys({
    name: Joi.string().required(),
  }),
}

const updateServiceCategory = {
  params: Joi.object().keys({
    category_id: Joi.required().custom(objectId),
  }),
  body: Joi.object().keys({
    name: Joi.string(),
  }),
}

const deleteServiceCategory = {
  params: Joi.object().keys({
    category_id: Joi.required().custom(objectId),
  }),
}

module.exports = {
  createServiceType,
  updateServiceType,
  deleteServiceType,
  getServicesByBeautician,
  createService,
  updateService,
  deleteService,
  createServiceCategory,
  updateServiceCategory,
  deleteServiceCategory
}