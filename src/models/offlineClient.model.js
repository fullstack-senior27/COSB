const mongoose = require('mongoose');
const validator = require('validator');
const { toJSON, paginate } = require('./plugins');

const offlineClientSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  mobileNumber: {
    type: String,
    required: true
  },
  homeNumber: {
    type: String
  },
  streetAddress: {
    type: String
  },
  apt: {
    type: Number
  },
  city: {
    type: String
  },
  state: {
    type: String
  },
  zip: {
    type: String
  },
  birthday: {
    type: String
  }
}, {
  timestamps: true
})

offlineClientSchema.plugin(paginate);

const offlineClient = mongoose.model('OfflineClient', offlineClientSchema);

module.exports = offlineClient;