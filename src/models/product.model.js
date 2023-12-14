const mongoose = require('mongoose');
const validator = require('validator');
const { paginate } = require('./plugins');

const productSchema = mongoose.Schema({
  beautician: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Beautician'
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  isAvailable: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
})

productSchema.plugin(paginate);

const Product = mongoose.model('Product', productSchema);

module.exports = Product;