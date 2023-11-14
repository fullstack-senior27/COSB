const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const { toJSON, paginate } = require('./plugins');

const noteSchema = mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  }
})

const beauticianSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      required: false,
      default: null
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
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 8,
      validate(value) {
        if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
          throw new Error('Password must contain at least one letter and one number');
        }
      },
      private: true, // used by the toJSON plugin
    },
    role: {
      type: String,
      default: 'beautician',
    },
    photos: [
      {
        type: String,
        default: null
      }
    ],
    profession: {
      type: String,
      default: ""
    },
    about: {
      type: String,
      default: null
    },
    website: {
      type: String,
      default: null
    },
    notes: [
      noteSchema
    ],
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    speciality: [
      {
        type: String
      }
    ],
    services: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service'
      }
    ],
    service_categories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service_category'
      }
    ],
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review'
      }
    ],
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
      }
    ],
    availability: [
      {
        date: {
          type: Date,
          default: ""
        },
        day: {
          type: String,
          default: ""
        },
        startTime: {
          type: String,
          default: ""
        },
        endTime: {
          type: String,
          default: ""
        },
        isAvailable: {
          type: Boolean,
          default: false
        }
      }
    ],
    salon_number: {
      type: String
    },
    business_name: {
      type: String
    },
    address: {
      type: String,
      trim: true
    },
    accountId: {
      type: String,
      default: ""
    },
    blockedClients: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      }
    ],
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
beauticianSchema.plugin(toJSON);
beauticianSchema.plugin(paginate);

/**
 * Check if email is taken
 * @param {string} email - The user's email
 * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
beauticianSchema.statics.isEmailTaken = async function (email, excludeUserId) {
  const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
  return !!user;
};

beauticianSchema.statics.isPhoneNoTaken = async function (phone, excludeUserId) {
  const user = await this.findOne({ phone, _id: { $ne: excludeUserId } });
  return !!user;
};

/**
 * Check if password matches the user's password
 * @param {string} password
 * @returns {Promise<boolean>}
 */
beauticianSchema.methods.isPasswordMatch = async function (password) {
  const user = this;
  return bcrypt.compare(password, user.password);
};

beauticianSchema.pre('save', async function (next) {
  const user = this;
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

const Beautician = mongoose.model('Beautician', beauticianSchema);

module.exports = Beautician;
