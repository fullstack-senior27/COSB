const mongoose = require('mongoose');
const { toJSON } = require('./plugins');

const helpSchema = mongoose.Schema(
  {
    question: {
      type: String,
    },
    answer: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// helpSchema.plugin(paginate);

const Help = mongoose.model('Help', helpSchema);

module.exports = Help;
