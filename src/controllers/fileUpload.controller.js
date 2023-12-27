const httpStatus = require('http-status');
const ApiSuccess = require('../utils/ApiSuccess');
const catchAsync = require('../utils/catchAsync');
const { fileUploadService } = require('../services');



const uploadFile = catchAsync(async (req, res) => {
  const getFileUploadUrl = await fileUploadService.uploadFile(req);
  return new ApiSuccess(res, httpStatus.OK, 'File Uploaded Successfully!', getFileUploadUrl);
});

module.exports = {
  uploadFile,
};


