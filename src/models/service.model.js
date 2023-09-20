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
    salon: { type: mongoose.Schema.Types.ObjectId, ref: 'salons' },
    service_type: { type: mongoose.Schema.Types.ObjectId, ref: 'service_types' },
    time: {
      type: String,
      required: true,
      trim: true,
    },

    price: {
      type: Number,
      required: true,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

serviceSchema.plugin(toJSON);

const Service = mongoose.model('services', serviceSchema);
module.exports = Service;
