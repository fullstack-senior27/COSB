const Joi = require('joi');
const { password, objectId } = require('./custom.validation');

const registerNewClient = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    email: Joi.string().required(),
    mobileNumber: Joi.string().required(),
    homeNumber: Joi.string(),
    streetAddress: Joi.string(),
    apt: Joi.number(),
    city: Joi.string(),
    state: Joi.string(),
    zip: Joi.string(),
    birthday: Joi.string()
  }),
};

module.exports = {
  registerNewClient
}
