const httpStatus = require("http-status");
const ApiSuccess = require("../utils/ApiSuccess");
const catchAsync = require("../utils/catchAsync");
const { clientService, userService } = require("../services");

const getAllClientsForBeautician = catchAsync(async (req, res) => {
  const clients = await clientService.getClientsByBeauticianId(req.user._id);
  return new ApiSuccess(res, httpStatus.OK, "Cients fetched successfully", clients)
})

// const createClient = catchAsync(async (req, res) => {
//   const client = await clientService.createClient(req.body);
//   return new ApiSuccess(res, httpStatus.CREATED, "Client created successfully", client)
// })

const registerNewClient = catchAsync(async (req, res) => {
  const client = await clientService.registerClient(req.body, req.user._id)
  return new ApiSuccess(res, httpStatus.CREATED, "Client registered successfully", client)
})

module.exports = {
  getAllClientsForBeautician,
  // createClient,
  registerNewClient
}