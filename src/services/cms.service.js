const httpStatus = require('http-status');
const { Help } = require('../models');
const ApiError = require('../utils/ApiError');

const getHelpContentById = async (id) => {
  const help = await Help.findOne({ _id: id });
  if (!help) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Content does not exist');
  }
  return help;
};

const createHelpContent = async (createBody) => {
  const help = await Help.create(createBody);
  return help;
};

const editHelpContent = async (id, updateBody) => {
  const help = await getHelpContentById(id);
  Object.assign(help, updateBody);
  await help.save();
  return help;
};

const deleteHelpContent = async (id) => {
  const help = await Help.findByIdAndDelete(id);
  if (!help) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Content does not exist');
  }
  return help;
};

const getAllHelpContent = async () => {
  const list = await Help.find();
  return list;
};

module.exports = {
  createHelpContent,
  getHelpContentById,
  editHelpContent,
  deleteHelpContent,
  getAllHelpContent,
};
