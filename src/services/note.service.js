const httpStatus = require("http-status")
const { Note } = require("../models")
const ApiError = require("../utils/ApiError")

const createNote = async (noteBody, beauticianId) => {
  const note = await Note.create({
    ...noteBody,
    beautician: beauticianId
  })

  if (!note) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Cannot create note!");
  }
  return note;
}

const getNotesByClientId = async (clientId) => {
  const notes = await Note.find({
    client: clientId
  }).populate('products')

  return notes;
}

module.exports = {
  createNote,
  getNotesByClientId
}