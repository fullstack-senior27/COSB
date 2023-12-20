const mongoose = require('mongoose');
const validator = require('validator');
const { toJSON, paginate } = require('./plugins');

const clientSchema = mongoose.Schema({
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  beautician: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Beautician'
  },
  photos: [
    {
      type: String,
      default: ""
    }
  ]
}, {
  timestamps: true
})

clientSchema.plugin(paginate);

const Client = mongoose.model('Client', clientSchema);

module.exports = Client;