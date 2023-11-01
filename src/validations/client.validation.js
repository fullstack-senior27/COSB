const Joi = require('joi');
const { password, objectId } = require('./custom.validation');

const registerNewClient = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    email: Joi.string().required(),
    phone: Joi.string().required(),
    // role: Joi.string().required().valid('user', 'beautician', 'admin')
  }),
};

module.exports = {
  registerNewClient
}
