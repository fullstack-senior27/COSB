const httpStatus = require("http-status");
const { appointmentService, _service } = require("../services");
const ApiSuccess = require("../utils/ApiSuccess");
const catchAsync = require("../utils/catchAsync");
const ApiError = require("../utils/ApiError");
const pick = require("../utils/pick");

const createAppointment = catchAsync(async (req, res) => {
  const { user, beautician, date, zipcode, services, startTime } = req.body;
  // const user = req.user._id;
  // if (user.toString() !== req.user._id.toString()) {
  //   throw new ApiError(httpStatus.FORBIDDEN, "You are not allowed");
  // }
  let amount = 0;
  for (let service_id of services) {
    const service = await _service.getServiceById(service_id);
    amount += service.price;
  }
  const appointment = await appointmentService.createAppointment({ beautician, date, zipcode, user, services, amount, startTime });


  return new ApiSuccess(res, httpStatus.CREATED, "Appointment created successfully", appointment);

})

const updateAppointment = catchAsync(async (req, res) => {
  const { services } = req.body;
  let amount = 0;
  for (let service_id of services) {
    const service = await _service.getServiceById(service_id);
    amount += service.price;
  }
  req.body.amount = amount;
  const appointment = await appointmentService.updateAppointment(req.params.appointmentId, req.body);
  if (!appointment) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Appointment not updated");
  }
  return new ApiSuccess(res, httpStatus.OK, "Appointment updated successfully", appointment)
})


const getAppointmentByBeauticianId = catchAsync(async (req, res) => {
  console.log("user: ", req.user._id);
  const appointments = await appointmentService.getAppointmentsByBeauticianId(req.user._id);
  console.log(appointments)
  const options = pick(req.query, ['limit', 'page'])
  const page = parseInt(options.page) || 1; // Current page, default to 1 if not provided
  const limit = parseInt(options.limit) || 10;
  const skip = (page - 1) * limit;
  const paginatedAppointments = appointments.slice(skip, skip + limit);
  if (!appointments) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Server error")
  }
  return res.status(httpStatus.OK).json({
    code: httpStatus.OK,
    message: 'Appointments fetched successfully',
    isSuccess: true,
    data: {
      results: paginatedAppointments,
      totalPages: Math.ceil(appointments.length / limit),
      currentPage: page,
      limit: limit,
      totalResults: paginatedAppointments.length
    }
  })
})

const getAppointmentsByUserId = catchAsync(async (req, res) => {
  const appointments = await appointmentService.getAppointmentsByUserId(req.user._id);
  const options = pick(req.query, ['limit', 'page'])
  const page = parseInt(options.page) || 1; // Current page, default to 1 if not provided
  const limit = parseInt(options.limit) || 10;
  const skip = (page - 1) * limit;
  const paginatedAppointments = appointments.slice(skip, skip + limit);
  return res.status(httpStatus.OK).json({
    code: httpStatus.OK,
    message: 'Appointments fetched successfully',
    isSuccess: true,
    data: {
      results: paginatedAppointments,
      totalPages: Math.ceil(appointments.length / limit),
      currentPage: page,
      limit: limit,
      totalResults: paginatedAppointments.length
    }
  })
})

const getAppointmentDetails = catchAsync(async (req, res) => {
  const appointment = await appointmentService.getAppointmentById(req.params.appointmentId);
  if (!appointment) {
    throw new Error(httpStatus.INTERNAL_SERVER_ERROR, "Internal Server error");
  }
  return new ApiSuccess(res, httpStatus.OK, "Appointment fetched successfully", appointment);
})

module.exports = {
  createAppointment,
  updateAppointment,
  getAppointmentByBeauticianId,
  getAppointmentsByUserId,
  getAppointmentDetails
}