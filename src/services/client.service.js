const httpStatus = require('http-status');
const { userService, beauticianService } = require('.');
const { Client, User, Note } = require('../models');
const ApiError = require('../utils/ApiError');

const getClientsByBeauticianId = async (beauticianId) => {
  const clients = await Client.find({
    beautician: beauticianId,
  })
    .sort({ createdAt: 'desc' })
    .populate('client');
  return clients;
};

const createClient = async (beautician, user) => {
  let client;
  client = await Client.create({
    beautician,
    client: user._id,
  });
  return client;
};

const registerClient = async (userBody, beautician) => {
  const { email } = userBody;
  userBody.password = 'test12345';
  const existingUser = await userService.getUserByEmail(email);
  // const existingOfflineUser = await OfflineClient.findOne({ email });
  if (existingUser) {
    throw new ApiError(httpStatus.CONFLICT, 'User is already registered with this email');
  }
  const user = await User.create(userBody);
  const client = await createClient(beautician, user);
  return client;
};

const updateClient = async (updateBody, clientId) => {
  const client = await User.findOne({ _id: clientId });

  if (!client) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Client does not exist');
  }
  Object.assign(client, updateBody);
  await client.save();
  return client;
};

const blockClient = async (clientId, reason, beautician) => {
  const client = await User.findOne({ _id: clientId });
  const ifClient = await Client.findOne({ client: clientId, beautician: beautician._id });
  if (!ifClient) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not a client');
  }
  if (!client) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Client does not exist');
  }
  ifClient.isBlocked = true;
  ifClient.reasonForBlocking = reason;
  await ifClient.save();
  beautician.blockedClients.push(clientId);
  await beautician.save();
  return client;
};

const deleteClient = async (clientId, beauticianId) => {
  // const user = await userService.getUserById(clientId)
  const client = await Client.findOne({
    client: clientId,
    beautician: beauticianId,
  });
  if (!client) {
    throw new ApiError(httpStatus.NOT_FOUND, 'client does not exist');
  }
  await client.remove();
  return;
};

const getClientDetails = async (clientId, beauticianId) => {
  const client = await Client.findOne({ client: clientId, beautician: beauticianId }).populate('client');
  if (!client) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Client does not exist');
  }
  // const user = await User.findById(clientId);
  const clientNote = await Note.find({
    client: clientId,
    beautician: beauticianId,
  });

  const response = {
    client: client.client,
    photos: client.photos,
    clientNote: clientNote,
  };
  return response;
};

const uploadClientPhoto = async (clientId, beauticianId, photos) => {
  const updatedClient = await Client.findOne({ client: clientId, beautician: beauticianId, isBlocked: false });
  if (!updatedClient) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Client does not exist or might be blocked');
  }
  updatedClient.photos.push(...photos);
  await updatedClient.save();
  return updatedClient;
};

module.exports = {
  getClientsByBeauticianId,
  createClient,
  registerClient,
  updateClient,
  blockClient,
  getClientDetails,
  deleteClient,
  uploadClientPhoto,
};
