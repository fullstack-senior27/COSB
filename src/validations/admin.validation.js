const Joi = require('joi');

const editProfile = {
  body: Joi.object().keys({
    name: Joi.string(),
    imageUrl: Joi.string()
  })
}

module.exports = {
  editProfile
}
