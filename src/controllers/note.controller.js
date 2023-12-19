const httpStatus = require("http-status");
const ApiSuccess = require("../utils/ApiSuccess");
const catchAsync = require("../utils/catchAsync");
const { noteService } = require("../services");

const createNote = catchAsync(async (req, res) => {
  const note = await noteService.createNote(req.body, req.user._id);
  return new ApiSuccess(res, httpStatus.CREATED, "Note created successfully", note);
})

const getNotesByClientId = catchAsync(async (req, res) => {
  const notes = await noteService.getNotesByClientId(req.query.clientId);
  return new ApiSuccess(res, httpStatus.OK, "Notes fetched successfully", notes);
})

module.exports = {
  createNote,
  getNotesByClientId
}