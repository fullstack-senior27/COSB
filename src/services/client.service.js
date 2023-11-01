const { userService, clientService } = require(".");
const { Client } = require("../models")

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
  return client;
}

const registerClient = async (userBody, beautician) => {
  const { name, email, phone } = userBody;
  const user = await userService.createUser({
    name,
    email,
    phone,
    password: "user1234",
    role: "user"
  });
  const client = await createClient(beautician, user._id)
  return client;
}

module.exports = {
  getClientsByBeauticianId,
  createClient,
  registerClient
}