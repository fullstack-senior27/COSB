const mongoose = require('mongoose');

const promotionSchema = mongoose.Schema({
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
  applyTo: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service"
    }
  ],
  startDate: {
    type: Date
  },
  endDate: {
    type: Date
  },
  promotionValue: {
    type: Number
  },
  limit: {
    type: Number
  }
}, {
  timestamps: true
})

const Promotion = mongoose.model('Promotion', promotionSchema);

module.exports = Promotion;