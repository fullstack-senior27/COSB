const httpStatus = require('http-status');
const { Help, KnowledgeBase } = require('../models');
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

const createKnowledgeBaseContent = async (createBody) => {
  const data = await KnowledgeBase.create(createBody);
  return data;
};

const editKnowledgeBaseContent = async (id, updateBody) => {
  const data = await KnowledgeBase.findOne({ _id: id });
  if (!data) {
    throw new ApiError(httpStatus.NOT_FOUND, 'content not found');
  }
  Object.assign(data, updateBody);
  await data.save();
  return data;
};

const deleteKnowledgeBaseContent = async (id) => {
  const data = await KnowledgeBase.findByIdAndDelete(id);
  if (!data) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Content not found');
  }
  return data;
};

const getAllKnowledgeBaseContent = async (key) => {
  let data;
  if (key) {
    data = await KnowledgeBase.find({ key });
  } else {
    data = await KnowledgeBase.find();
  }
  return data;
};

const getKnowledgeBaseContentById = async (id) => {
  const data = await KnowledgeBase.findOne({ _id: id });
  if (!data) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Content not found');
  }
  return data;
};

module.exports = {
  createHelpContent,
  getHelpContentById,
  editHelpContent,
  deleteHelpContent,
  getAllHelpContent,
  createKnowledgeBaseContent,
  editKnowledgeBaseContent,
  deleteKnowledgeBaseContent,
  getAllKnowledgeBaseContent,
  getKnowledgeBaseContentById,
};
