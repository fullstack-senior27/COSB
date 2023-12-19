const mongoose = require('mongoose');
const validator = require('validator');
const { toJSON, paginate } = require('./plugins');

const noteSchema = mongoose.Schema({
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  beautician: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Beautician"
  },
  note: {
    type: String,
    default: ""
  },
  formula: {
    type: String,
    default: ""
  },
  products: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }
  ]
}, {
  timestamps: true
})

noteSchema.plugin(paginate);

const Note = mongoose.model('Note', noteSchema);

module.exports = Note;