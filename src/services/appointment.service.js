const httpStatus = require('http-status');
const { Appointment, Client } = require('../models');
const ApiError = require('../utils/ApiError');
const { getBeauticianById } = require('./beautician.service');
const clientService = require('./client.service');
const { userService } = require('.');

const createAppointment = async (appointmentBody) => {
  const { date, beautician, timeSlot, user } = appointmentBody;
  const existingUser = await userService.getUserById(user);
  const existingBeautician = await getBeauticianById(beautician);
  appointmentBody.customerId = existingUser.customerId;
  // const isDateAvailable = existingBeautician.availableDays.some((d) => {
  //   const year = d.date.getFullYear();
  //   const month = (d.date.getMonth() + 1).toString().padStart(2, '0'); // Month is zero-based
  //   const day = d.date.getDate().toString().padStart(2, '0');

  //   const formattedDateString = `${year}-${month}-${day}`;

  //   if (formattedDateString === date && d.isAvailable) {
  //     return true;
  //   }
  // });
  let selectedSlot;
  const isMorningSlotAvailable = existingBeautician.morning.some((t) => {
    if (t.time === timeSlot) {
      selectedSlot = 'morning';
      if (!t.isBooked) {
        return true;
      }
    }
  });
  const isEveningSlotAvailable = existingBeautician.evening.some((t) => {
    if (t.time === timeSlot) {
      selectedSlot = 'evening';
      if (!t.isBooked) {
        return true;
      }
    }
  });
  const isAfternoonSlotAvailable = existingBeautician.afternoon.some((t) => {
    if (t.time === timeSlot) {
      selectedSlot = 'afternoon';
      if (!t.isBooked) {
        return true;
      }
    }
  });

  const isAppointmentDateAvailable = await Appointment.findOne({
    date,
    timeSlot,
  });
  if (isAppointmentDateAvailable) {
    throw new ApiError(httpStatus.CONFLICT, 'The date is already booked');
  }

  if (!isAppointmentDateAvailable && (isMorningSlotAvailable || isAfternoonSlotAvailable || isEveningSlotAvailable)) {
    const appointment = await Appointment.create(appointmentBody);
    const index = existingBeautician[selectedSlot].findIndex((i) => {
      return i.time === timeSlot;
    });
    if (index !== -1) {
      existingBeautician[selectedSlot][index].isBooked = true;
    }
    await existingBeautician.save();

    return appointment;
  }
  throw new ApiError(httpStatus.BAD_REQUEST, 'Could not create appointment!');
};

// const createAppointments = async (appointmentBody) => {
//   // check if the dates are available
//   const { date, beautician, startTime, endTime, user } = appointmentBody
//   const existingUser = await userService.getUserById(user);
//   const existingBeautician = await getBeauticianById(beautician);
//   appointmentBody.customerId = existingUser.customerId;
//   const isBeauticianAvailable = existingBeautician.availableDays.some(slot => {
//     const year = slot.date.getFullYear();
//     const month = (slot.date.getMonth() + 1).toString().padStart(2, '0'); // Month is zero-based
//     const day = slot.date.getDate().toString().padStart(2, '0');

//     // Format it as 'YYYY-MM-DD' string
//     const formattedDateString = `${year}-${month}-${day}`;
//     if (formattedDateString === date && slot.isAvailable) {
//       // Check if any time slot is available and not booked
//       return slot.timeSlots.find((timeSlot) => {
//         // const startTime = '08:00'; // Replace with actual startTime
//         // const endTime = '12:00'; // Replace with actual endTime
//         if (timeSlot.startTime === startTime && timeSlot.endTime === endTime) {
//           if (!timeSlot.isBooked) {
//             return true;
//           }
//         }
//       });
//     }

//     return false;
//   })

//   // const existingAppointment = await Appointment.findOne({
//   //   startTime: startTime,
//   //   endTime: endTime
//   // })
//   if (!isBeauticianAvailable) {
//     // console.log(existingAppointment)
//     throw new ApiError(httpStatus.CONFLICT, 'Not available')
//   }

//   const appointment = await Appointment.create(appointmentBody);
//   const slotIndex = existingBeautician.availableDays.findIndex(slot => {
//     const year = slot.date.getFullYear();
//     const month = (slot.date.getMonth() + 1).toString().padStart(2, '0'); // Month is zero-based
//     const day = slot.date.getDate().toString().padStart(2, '0');

//     // Format it as 'YYYY-MM-DD' string
//     const formattedDateString = `${year}-${month}-${day}`;
//     return (
//       formattedDateString === date &&
//       // slot.startTime <= startTime &&
//       slot.isAvailable
//     );
//   });
//   if (slotIndex !== -1) {
//     // for (let s of existingBeautician.availableDays[slotIndex].timeSlots) {
//     //   if (s.startTime === startTime && s.endTime === endTime) {
//     //     console.log("Here:------------------")
//     //     existingBeautician.availableDays[slotIndex].timeSlots[]
//     //     s.isBooked = true;
//     //     console.log(s);
//     //     break;
//     //   }
//     // }
//     const index = existingBeautician.availableDays[slotIndex].timeSlots.findIndex((timeSlot) => {
//       return (
//         timeSlot.startTime === startTime &&
//         timeSlot.endTime === endTime
//       );
//     });
//     if (index !== -1) {
//       existingBeautician.availableDays[slotIndex].timeSlots[index].isBooked = true;
//       await existingBeautician.save();
//     }
//     // existingBeautician.availableDays[slotIndex].timeSlots[index].isBooked = true;
//     const existingClient = await Client.findOne({
//       beautician,
//       user
//     })
//     console.log(existingClient);
//     // const existingClient = existingBeautician.clients.find(u => u === user)
//     if (!existingClient) {
//       // existingBeautician.clients.push(user)
//       clientService.createClient(beautician, user);
//     }
//     await existingBeautician.save()
//   }

//   return appointment;
// };

const getAppointmentsByUserId = async (userId) => {
  const appointments = await Appointment.aggregate([
    {
      $match: { user: userId },
    },
    {
      $sort: { createdAt: -1 },
    },
    {
      $lookup: {
        from: 'beauticians', // Assuming the collection name is 'users' for beauticians
        localField: 'beautician',
        foreignField: '_id',
        as: 'beautician',
      },
    },
    {
      $unwind: '$beautician',
    },
    {
      $lookup: {
        from: 'services', // Assuming the collection name is 'services' for services
        localField: 'services',
        foreignField: '_id',
        as: 'services',
      },
    },
    {
      $lookup: {
        from: 'reviews', // Assuming the collection name is 'reviews' for reviews
        localField: 'beautician.reviews',
        foreignField: '_id',
        as: 'beautician.reviews',
      },
    },
    {
      $addFields: {
        'beautician.averageRating': {
          $avg: '$beautician.reviews.rating',
        },
      },
    },
  ]);

  return appointments;
};

const getAppointmentsByBeauticianId = async (beauticianId) => {
  console.log(beauticianId);
  const appointments = await Appointment.find({
    beautician: beauticianId,
  })
    .sort({ createdAt: 'desc' })
    .populate('user')
    .populate('beautician')
    .populate('services');

  return appointments;
};

const getAppointmentById = async (appointmentId) => {
  const appointment = await Appointment.findById(appointmentId).populate('user').populate('beautician').populate('services');

  return appointment;
};

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
  Object.assign(appointment, updateBody);

  await appointment.save();
  return appointment;
};

module.exports = {
  createAppointment,
  getAppointmentsByUserId,
  updateAppointment,
  getAppointmentsByBeauticianId,
  getAppointmentById,
};
