const httpStatus = require('http-status');
const { Appointment, Client } = require('../models');
const ApiError = require('../utils/ApiError');
const { getBeauticianById } = require('./beautician.service');
const clientService = require('./client.service');
const { userService } = require('.');


const createAppointment = async (appointmentBody) => {
  // check if the dates are available
  const { date, beautician, startTime, user } = appointmentBody
  const existingUser = await userService.getUserById(user);
  const existingBeautician = await getBeauticianById(beautician);
  appointmentBody.customerId = existingUser.customerId;
  const isBeauticianAvailable = existingBeautician.availability.some(slot => {
    const year = slot.date.getFullYear();
    const month = (slot.date.getMonth() + 1).toString().padStart(2, '0'); // Month is zero-based
    const day = slot.date.getDate().toString().padStart(2, '0');

    // Format it as 'YYYY-MM-DD' string
    const formattedDateString = `${year}-${month}-${day}`;
    return (
      formattedDateString === date &&
      // slot.startTime <= startTime &&
      slot.isAvailable
    )
  })

  if (!isBeauticianAvailable) {
    throw new ApiError(httpStatus.CONFLICT, 'Not available')
  }


  const appointment = await Appointment.create(appointmentBody);
  const slotIndex = existingBeautician.availability.findIndex(slot => {
    const year = slot.date.getFullYear();
    const month = (slot.date.getMonth() + 1).toString().padStart(2, '0'); // Month is zero-based
    const day = slot.date.getDate().toString().padStart(2, '0');

    // Format it as 'YYYY-MM-DD' string
    const formattedDateString = `${year}-${month}-${day}`;
    return (
      formattedDateString === date &&
      // slot.startTime <= startTime &&
      slot.isAvailable
    );
  });
  if (slotIndex !== -1) {
    existingBeautician.availability[slotIndex].isAvailable = false;
    const existingClient = await Client.findOne({
      beautician,
      user
    })
    console.log(existingClient);
    // const existingClient = existingBeautician.clients.find(u => u === user)
    if (!existingClient) {
      // existingBeautician.clients.push(user)
      clientService.createClient(beautician, user);
    }
    await existingBeautician.save()
  }

  return appointment;
};

const getAppointmentsByUserId = async (userId) => {
  const appointments = await Appointment.find({
    user: userId
  }).sort({ createdAt: 'desc' }).populate('user').populate('beautician').populate('services');
  console.log("appointments: ", appointments)
  return appointments;
}

const getAppointmentsByBeauticianId = async (beauticianId) => {
  console.log(beauticianId)
  const appointments = await Appointment.find({
    beautician: beauticianId
  }).sort({ createdAt: 'desc' }).populate('user').populate('beautician').populate('services')

  return appointments
}

const getAppointmentById = async (appointmentId) => {
  const appointment = await Appointment.findById(appointmentId)
    .populate('user')
    .populate('beautician')
    .populate('services')

  return appointment;
}

// const addMoreServices = async (appointmentId, { services }) => {

// }

const updateAppointment = async (appointmentId, updateBody) => {
  const appointment = await getAppointmentById(appointmentId);
  // check if the newDate is available
  // if (!appointment) {
  //   throw new ApiError(httpStatus.NOT_FOUND, "Appointment not found")
  // }
  // appointment.date = newDate;
  // if (services) {
  //   for(let service of services) {
  //     appointment.services.push(service);
  //   }
  // }
  Object.assign(appointment, updateBody)

  await appointment.save();
  return appointment;
}


module.exports = {
  createAppointment,
  getAppointmentsByUserId,
  updateAppointment,
  getAppointmentsByBeauticianId,
  getAppointmentById
}
