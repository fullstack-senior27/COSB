const mongoose = require('mongoose');
const validator = require('validator');
const { toJSON, paginate } = require('./plugins');

const serviceTypeSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

serviceTypeSchema.plugin(toJSON);


const ServiceType = mongoose.model('Service_type', serviceTypeSchema);
module.exports = ServiceType;
