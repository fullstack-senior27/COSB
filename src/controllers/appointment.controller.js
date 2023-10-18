const httpStatus = require("http-status");
const { appointmentService, _service } = require("../services");
const ApiSuccess = require("../utils/ApiSuccess");
const catchAsync = require("../utils/catchAsync");
const ApiError = require("../utils/ApiError");

const createAppointment = catchAsync(async (req, res) => {
  const { beautician, date, zipcode, services } = req.body;
  const user = req.user._id;
  let amount = 0;
  for (let service_id of services) {
    const service = await _service.getServiceById(service_id);
    amount += service.price;
  }
  const appointment = await appointmentService.createAppointment({ beautician, date, zipcode, user, services, amount });
  return new ApiSuccess(res, httpStatus.CREATED, "Appointment created successfully", appointment);
})

const updateAppointment = catchAsync(async (req, res) => {
  const appointment = await appointmentService.updateAppointment(req.params.appointmentId, req.body);
  if (!appointment) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Appointment not updated");
  }
  return new ApiSuccess(res, httpStatus.OK, "Appointment updated successfully", appointment)
})

module.exports = {
  createAppointment,
  updateAppointment
}