const httpStatus = require("http-status");
const { userService, clientService } = require(".");
const { Client, OfflineClient } = require("../models");
const ApiError = require("../utils/ApiError");

const getClientsByBeauticianId = async (beauticianId) => {
  const clients = await Client.find({
    beautician: beauticianId
  }).sort({ createdAt: 'desc' }).populate('client');
  return clients;
}

const createClient = async (beautician, user) => {
  const client = await Client.create({
    beautician,
    client: user
  })
  console.log(client)
  return client;
}


const registerClient = async (userBody, beautician) => {
  const { email } = userBody;
  const existingUser = await userService.getUserByEmail(email);
  const existingOfflineUser = await OfflineClient.findOne({ email });
  if (existingUser) {
    throw new ApiError(httpStatus.CONFLICT, "User is already registered with this email");
  }
  if (existingOfflineUser) {
    throw new ApiError(httpStatus.CONFLICT, "Client already exists")
  }
  const user = await OfflineClient.create(userBody);
  const client = await createClient(beautician, user._id)
  return client;
}

module.exports = {
  getClientsByBeauticianId,
  createClient,
  registerClient
}