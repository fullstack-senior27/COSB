const httpStatus = require("http-status");
const { beauticianService } = require(".");
const ApiError = require("../utils/ApiError");

const addAvailableDay = async (updateBody, cur_user) => {
  // console.log("cur user", cur_user)
  const beautician = await beauticianService.getBeauticianByEmail(cur_user.email);
  // console.log(beautician);
  if (!beautician) {
    throw new ApiError(httpStatus.NOT_FOUND, "Beautician does not exist");
  }
  Object.assign(beautician, updateBody);

  await beautician.save();
  return beautician;
}

// const updateDateAndTime = async (updateBody, cur_user) => {
//   // const { day,  } = updateBody;
//   const beautician = await beauticianService.getBeauticianByEmail(cur_user.email)
//   if (!beautician) {
//     throw new ApiError(httpStatus.NOT_FOUND, "Beautician does not exist");
//   }
//   // for (let a of beautician.availability) {
//   //   for (let d of days) {
//   //     if (a.day === d.day) {
//   //       Object.assign(a, d);
//   //     }
//   //   }
//   // }
//   Object.assign(beautician, updateBody);
//   await beautician.save();
//   return beautician;
// }

const updateSlots = async (slots, cur_user) => {
  const beautician = await beauticianService.getBeauticianByEmail(cur_user.email);
  Object.assign(beautician, slots);
  await beautician.save();
}

const getAvailabilityForBeautician = async (beauticianId) => {
  const beautician = await beauticianService.getBeauticianById(beauticianId);
  return {
    days: beautician.availableDays,
    slots: {
      morning: beautician.morning,
      afternoon: beautician.afternoon,
      evening: beautician.evening
    }
  };
}

module.exports = {
  addAvailableDay,
  // updateDateAndTime,
  getAvailabilityForBeautician,
  updateSlots
}