const httpStatus = require("http-status");
const ApiSuccess = require("../utils/ApiSuccess");
const catchAsync = require("../utils/catchAsync");
const { availabilityService } = require("../services");

const addAvailability = catchAsync(async (req, res) => {
  // req.body should be a day string.
  const beautician = await availabilityService.addAvailableDay(req.body, req.user);
  return new ApiSuccess(res, httpStatus.OK, "Availibility added successfully", beautician);
})

// const updateDateAndTime = catchAsync(async (req, res) => {
//   // req.body should be a day string.
//   const beautician = await availabilityService.updateDateAndTime(req.body, req.user);
//   return new ApiSuccess(res, httpStatus.OK, "Availibility updated successfully", beautician);
// })

const updateSlots = catchAsync(async (req, res) => {
  const beautician = await availabilityService.updateSlots(req.body, req.user);
  return new ApiSuccess(res, httpStatus.OK, "Slots added successfully", beautician);
})

const getAvailabilityForBeautician = catchAsync(async (req, res) => {
  const availability = await availabilityService.getAvailabilityForBeautician(req.query.beauticianId);
  return new ApiSuccess(res, httpStatus.OK, "Availability for beautician", availability);
})

module.exports = {
  addAvailability,
  // updateDateAndTime,
  getAvailabilityForBeautician,
  updateSlots
}