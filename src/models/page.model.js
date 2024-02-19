const mongoose = require('mongoose');
// const validator = require('validator');
const { toJSON, paginate } = require('./plugins');

const pageSchema = mongoose.Schema(
  {
    key: {
      type: String,
      unique: true,
    },
    data: {
      type: mongoose.Schema.Types.Mixed,
      // required: false,
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

pageSchema.plugin(paginate);

const Page = mongoose.model('Page', pageSchema);

module.exports = Page;
