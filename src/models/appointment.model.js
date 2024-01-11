const mongoose = require('mongoose');
const validator = require('validator');
const { toJSON, paginate } = require('./plugins');

const appointmentSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    beautician: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Beautician',
    },
    services: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service',
      },
    ],
    date: {
      type: Date,
      required: true,
    },
    timeSlot: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    zipcode: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['confirmed', 'cancelled'],
      default: 'confirmed',
    },
    paymentStatus: {
      type: String,
      enum: ['paid', 'pending'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

appointmentSchema.plugin(paginate);

const Appointment = mongoose.model('Appointment', appointmentSchema);

module.exports = Appointment;
