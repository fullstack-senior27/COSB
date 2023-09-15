const mongoose = require('mongoose');
const validator = require('validator');
const { toJSON, paginate } = require('./plugins');

const salonsSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    beautician_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Beautician' },
    image: {
      type: String,
      required: false,
      default: null,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    is_verified: {
      type: Boolean,
      required: false,
      default: false,
    },
    morning: {
      type: Array,
      required: false,
    },
    afternoon: {
      type: Array,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

salonsSchema.plugin(toJSON);

const Salon = mongoose.model('salons', salonsSchema);
module.exports = Salon;
