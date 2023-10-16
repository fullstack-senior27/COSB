const mongoose = require('mongoose');
const validator = require('validator');
const { toJSON, paginate } = require('./plugins');
const { string } = require('joi');

const serviceSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    beautician: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Beautician'
    },
    service_category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service_category'
    },
    service_type: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service_type'
    },
    isAvailable: {
      type: Boolean,
      default: false
    },
    durationInMinutes: {
      type: Number,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
  },
  {
    timestamps: true,
  }
);

serviceSchema.plugin(toJSON);
serviceSchema.plugin(paginate);

const Service = mongoose.model('Service', serviceSchema);
module.exports = Service;
