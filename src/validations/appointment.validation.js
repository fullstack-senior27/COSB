const Joi = require('joi');
const { password, objectId } = require('./custom.validation');

const createAppointment = {
  body: Joi.object().keys({
    user: Joi.required().custom(objectId),
    beautician: Joi.required().custom(objectId),
    date: Joi.string().required(),
    zipcode: Joi.string().required(),
    services: Joi.array().required(),
    startTime: Joi.string().required(),
    endTime: Joi.string().required()
  }),
};

const getAppointmentDetails = {
  params: Joi.object().keys({
    appointmentId: Joi.required().custom(objectId),
  }),
}

const updateAppointment = {
  params: Joi.object().keys({
    appointmentId: Joi.required().custom(objectId),
  }),
  body: Joi.object().keys({
    date: Joi.string(),
    services: Joi.array(),
    startTime: Joi.string()
  })
}

const getAppointmentByBeauticianId = {
  body: Joi.object().keys({
    beauticianId: Joi.required().custom(objectId)
  })
}

module.exports = {
  createAppointment,
  getAppointmentDetails,
  updateAppointment,
  getAppointmentByBeauticianId
}