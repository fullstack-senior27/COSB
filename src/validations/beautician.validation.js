const Joi = require('joi');

const createBeautician = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    name: Joi.string().required(),
    image: Joi.string().required(),
  }),
};

const createSalon = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    beautician_id: Joi.string().required(),
    address: Joi.string().required(),
    image: Joi.string().required(),
    is_verified: Joi.bool(),
    morning: Joi.array(),
    afternoon: Joi.array(),
  }),
};

const createService = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    beautician_id: Joi.string().required(),
    address: Joi.string().required(),
    image: Joi.string().required(),
    is_verified: Joi.bool(),
    morning: Joi.array(),
    afternoon: Joi.array(),
  }),
};

module.exports = { createBeautician, createSalon,createService };
