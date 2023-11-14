const Joi = require('joi');
const { password, objectId } = require('./custom.validation');

const registerNewClient = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    email: Joi.string().required(),
    phone: Joi.string().required(),
    homeNumber: Joi.string(),
    streetAddress: Joi.string(),
    apt: Joi.number(),
    city: Joi.string(),
    state: Joi.string(),
    zip: Joi.string(),
    birthday: Joi.string(),
    isOffline: Joi.boolean().required()
  }),
};

module.exports = {
  registerNewClient
}
