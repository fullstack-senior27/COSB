const httpStatus = require('http-status');
const ApiSuccess = require('../utils/ApiSuccess');
const catchAsync = require('../utils/catchAsync');
const { clientService, userService, fileUploadService } = require('../services');

const getAllClientsForBeautician = catchAsync(async (req, res) => {
  const clients = await clientService.getClientsByBeauticianId(req.user._id);
  return new ApiSuccess(res, httpStatus.OK, 'Cients fetched successfully', clients);
});

// const createClient = catchAsync(async (req, res) => {
//   const client = await clientService.createClient(req.body);
//   return new ApiSuccess(res, httpStatus.CREATED, "Client created successfully", client)
// })

const registerNewClient = catchAsync(async (req, res) => {
  const client = await clientService.registerClient(req.body, req.user._id);
  return new ApiSuccess(res, httpStatus.CREATED, 'Client registered successfully', client);
});

const updateClient = catchAsync(async (req, res) => {
  const updatedClient = await clientService.updateClient(req.body, req.query.clientId);
  return new ApiSuccess(res, httpStatus.OK, 'Client updated successfully', updatedClient);
});

const blockClient = catchAsync(async (req, res) => {
  const blockedClient = await clientService.blockClient(req.body.clientId, req.body.reason, req.user);
  return new ApiSuccess(res, httpStatus.OK, 'Client blocked successfully', blockedClient);
});

const getClientDetails = catchAsync(async (req, res) => {
  const clientDetails = await clientService.getClientDetails(req.params.clientId, req.user._id);
  return new ApiSuccess(res, httpStatus.OK, 'Client details', clientDetails);
});

const deleteClient = catchAsync(async (req, res) => {
  await clientService.deleteClient(req.query.clientId, req.user._id);
  return new ApiSuccess(res, httpStatus.OK, 'Client deleted successfully');
});

const uploadClientPhoto = catchAsync(async (req, res) => {
  const updatedClient = await clientService.uploadClientPhoto(req.query.clientId, req.user._id, req.body.photoUrls);
  return new ApiSuccess(res, httpStatus.OK, 'Client photo added successfully');
});

module.exports = {
  getAllClientsForBeautician,
  // createClient,
  registerNewClient,
  updateClient,
  blockClient,
  getClientDetails,
  deleteClient,
  uploadClientPhoto,
};
