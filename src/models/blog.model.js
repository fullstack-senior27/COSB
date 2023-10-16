const mongoose = require('mongoose');
// const validator = require('validator');
const { toJSON, paginate } = require('./plugins');

const blogSchema = mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Beautician"
  },
  title: {
    type: String,
    trim: true,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  blog_category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Blog_category'
  }
}, {
  timestamps: true
})

blogSchema.plugin(paginate);

const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;