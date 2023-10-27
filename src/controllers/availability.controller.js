const httpStatus = require("http-status");
const ApiSuccess = require("../utils/ApiSuccess");
const catchAsync = require("../utils/catchAsync");
const { availabilityService } = require("../services");

const addAvailability = catchAsync(async (req, res) => {
  // req.body should be a day string.
  const beautician = await availabilityService.addAvailableDay(req.body, req.user);
  return new ApiSuccess(res, httpStatus.OK, "Availibility added successfully", beautician);
})

const updateDateAndTime = catchAsync(async (req, res) => {
  // req.body should be a day string.
  const beautician = await availabilityService.updateDateAndTime(req.body, req.user);
  return new ApiSuccess(res, httpStatus.OK, "Availibility updated successfully", beautician);
})

module.exports = {
  addAvailability,
  updateDateAndTime
}