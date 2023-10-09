const mongoose = require('mongoose');
// const validator = require('validator');
const { toJSON, paginate } = require('./plugins');

const blogCategorySchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  }
}, {
  timestamps: true
})

blogCategorySchema.plugin(paginate);

const BlogCategory = mongoose.model('Blog_category', blogCategorySchema);

module.exports = BlogCategory;