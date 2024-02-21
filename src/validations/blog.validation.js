const Joi = require('joi');
const { password, objectId } = require('./custom.validation');

const createBlog = {
  body: Joi.object().keys({
    title: Joi.string().required(),
    description: Joi.string().required(),
    blog_category: Joi.string().required().custom(objectId),
    imageUrl: Joi.string(),
  }),
};

const updateBlog = {
  params: Joi.object().keys({
    blog_id: Joi.required().custom(objectId),
  }),
  body: Joi.object().keys({
    title: Joi.string(),
    description: Joi.string(),
    blog_category: Joi.string().custom(objectId),
    imageUrl: Joi.string(),
  }),
};

const getBlog = {
  params: Joi.object().keys({
    blog_id: Joi.required().custom(objectId),
  }),
};

module.exports = {
  createBlog,
  updateBlog,
  getBlog,
};
