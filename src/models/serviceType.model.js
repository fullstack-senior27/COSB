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

serviceTypeSchema.statics.isNameTaken = async function (name, excludeUserId) {
  const serviceType = await this.findOne({ name, _id: { $ne: excludeUserId } });
  return !!serviceType;
};

const ServiceType = mongoose.model('service_types', serviceTypeSchema);
module.exports = ServiceType;
