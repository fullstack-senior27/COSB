const mongoose = require('mongoose');
const validator = require('validator');
const { toJSON, paginate } = require('./plugins');

const ratingSchema = mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    salon: { type: mongoose.Schema.Types.ObjectId, ref: 'salons' },
    rating: {
      type: Number,
      require: true
    }
  },
  {
    timestamps: true,
  }
);

ratingSchema.plugin(toJSON);

const Rating = mongoose.model('salon_ratings', ratingSchema);
module.exports = Rating;
