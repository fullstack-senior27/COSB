const mongoose = require('mongoose');
const validator = require('validator');
const { toJSON, paginate } = require('./plugins');

const serviceSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    salons_id: { type: mongoose.Schema.Types.ObjectId, ref: 'salons' },
    serivce_type_id: { type: mongoose.Schema.Types.ObjectId, ref: 'service_types' },

    time: {
      type: String,
      required: true,
      trim: true,
    },

    price: {
      type: Array,
      required: Number,
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
