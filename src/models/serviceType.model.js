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
    services: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service'
      }
    ]
  },
  {
    timestamps: true,
  }
);

serviceTypeSchema.plugin(toJSON);


const ServiceType = mongoose.model('Service_type', serviceTypeSchema);
module.exports = ServiceType;
