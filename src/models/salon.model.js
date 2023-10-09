const mongoose = require('mongoose');
const validator = require('validator');
const { toJSON, paginate } = require('./plugins');

const salonSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    about: {
      type: String,
      required: true
    },
    contact: {
      type: String,
      required: true
    },
    services: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service'
      }
    ],
    beautician: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    service_categories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Service_category"
      }
    ],
    images: [
      {
        type: String,
        required: false,
        default: null,
      }
    ],
    address: {
      type: String,
      required: true,
      trim: true,
    },
    morning: {
      type: Array,
      required: false,
    },
    afternoon: {
      type: Array,
      required: false,
    },
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review'
      }

    ]
  },
  {
    timestamps: true,
  }
);

salonSchema.plugin(toJSON);

const Salon = mongoose.model('Salon', salonSchema);
module.exports = Salon;
