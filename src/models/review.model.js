const mongoose = require('mongoose');
const validator = require('validator');
const { toJSON, paginate } = require('./plugins');

const reviewSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  beautician: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Beautician'
  },
  text: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true
  }
}, {
  timestamps: true
})

reviewSchema.plugin(paginate);

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;