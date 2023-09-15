const mongoose = require('mongoose');
const validator = require('validator');
const { toJSON, paginate } = require('./plugins');

const beauticeanSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error('Invalid email');
        }
      },
    },
    image: {
      type: String,
      required: false,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

beauticeanSchema.plugin(toJSON);
beauticeanSchema.statics.isEmailTaken = async function (email, excludeUserId) {
  const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
  return !!user;
};

const Beautician = mongoose.model('Beautician', beauticeanSchema);
module.exports = Beautician;
