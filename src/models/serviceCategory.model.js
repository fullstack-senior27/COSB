const mongoose = require('mongoose');
const validator = require('validator');
const { toJSON, paginate } = require('./plugins');

const serviceCategorySchema = mongoose.Schema(
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

serviceCategorySchema.plugin(toJSON);

// serviceTypeSchema.statics.isNameTaken = async function (name, excludeUserId) {
//   const serviceType = await this.findOne({ name, _id: { $ne: excludeUserId } });
//   return !!serviceType;
// };

const ServiceCategory = mongoose.model('Service_category', serviceCategorySchema);
module.exports = ServiceCategory;
