const mongoose = require('mongoose');
// const validator = require('validator');
// const { toJSON, paginate } = require('./plugins');

const transactionSchema = mongoose.Schema(
  {
    beautician: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Beautician',
    },
    fee: {
      type: Number,
    },
    tip: {
      type: Number,
    },
    paymentMethod: {
      type: String,
    },
    bookingDateTime: {
      timeSlot: String,
      date: Date,
    },
    status: {
      type: String,
      enum: ['paid', 'unpaid'],
    },
    appointment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Appointment',
    },
    totalAmount: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
