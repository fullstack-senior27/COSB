const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createNote = {
  body: Joi.object().keys({
    client: Joi.string().required().custom(objectId),
    note: Joi.string().required(),
    formula: Joi.string(),
    products: Joi.array().custom(objectId)
  }),
};

module.exports = {
  createNote
}