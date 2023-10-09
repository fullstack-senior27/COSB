const mongoose = require('mongoose');
const validator = require('validator');
const { toJSON, paginate } = require('./plugins');

const reviewSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  salon: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Salon'
  },
  text: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true
  }
})

reviewSchema.plugin(paginate);

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;