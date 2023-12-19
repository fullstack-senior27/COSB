const mongoose = require('mongoose');
const validator = require('validator');
const { paginate } = require('./plugins');

const productSchema = mongoose.Schema({
  beautician: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Beautician'
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ""
  },
  link: {
    type: String,
    default: ""
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