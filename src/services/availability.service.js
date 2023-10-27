const httpStatus = require("http-status");
const { beauticianService } = require(".");
const ApiError = require("../utils/ApiError");

const addAvailableDay = async (updateBody, cur_user) => {
  const { days } = updateBody
  const beautician = await beauticianService.getBeauticianById(cur_user._id);
  if (!beautician) {
    throw new ApiError(httpStatus.NOT_FOUND, "Beautician does not exist");
  }
  if (Array.isArray(days)) {
    for (let day of days) {
      beautician.availability.push({
        day
      })
    }
  }
  await beautician.save();
  return beautician;
}

const updateDateAndTime = async (updateBody, cur_user) => {
  const { days } = updateBody;
  const beautician = await beauticianService.getBeauticianById(cur_user._id)
  if (!beautician) {
    throw new ApiError(httpStatus.NOT_FOUND, "Beautician does not exist");
  }
  for (let i = 0; i < days.length; i++) {
    console.log(days[i]);
    Object.assign(beautician.availability[i], days[i]);
  }
  await beautician.save();
  return beautician;
}

module.exports = {
  addAvailableDay,
  updateDateAndTime
}