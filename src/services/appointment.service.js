const httpStatus = require('http-status');
const { Appointment } = require('../models');
const ApiError = require('../utils/ApiError');


const createAppointment = async (appointmentBody) => {
  const appointment = await Appointment.create(appointmentBody);
  return appointment;
};

const getAppointmentsByUserId = async (userId) => {
  const appointments = await Appointment.find({
    user: userId
  }).sort({ createdAt: 'asc' }).populate('user').populate('beautician').populate('services');
  return appointments;
}

const getAppointmentById = async (appointmentId) => {
  const appointment = await Appointment.findById(appointmentId)
    .populate('user')
    .populate('beautician')
    .populate('services')

  return appointment;
}

const updateAppointment = async (appointmentId, { newDate, services }) => {
  const appointment = await getAppointmentById(appointmentId);
  // check if the newDate is available
  // if (!appointment) {
  //   throw new ApiError(httpStatus.NOT_FOUND, "Appointment not found")
  // }
  appointment.date = newDate;
  if (services) {
    for
      (let service of services) {
      appointment.services.push(service);
    }
  }
  await appointment.save();
  return appointment;
}
module.exports = {
  createAppointment,
  getAppointmentsByUserId,
  updateAppointment
}
