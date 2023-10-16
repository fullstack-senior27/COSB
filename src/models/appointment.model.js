const mongoose = require('mongoose');
const validator = require('validator');
const { toJSON, paginate } = require('./plugins');

const appointmentSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  salon: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Beautician'
  },
  services: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service"
    }
  ],
  date: {
    type: Date,
    required: true
  }
})

appointmentSchema.plugin(paginate);

const Appointment = mongoose.model('Appointment', appointmentSchema);

module.exports = Appointment;