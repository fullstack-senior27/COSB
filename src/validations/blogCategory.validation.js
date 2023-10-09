const Joi = require('joi');

const createBlogCategory = {
  body: Joi.object().keys({
    name: Joi.string().required(),
  }),
};


module.exports = {
  createBlogCategory
};
