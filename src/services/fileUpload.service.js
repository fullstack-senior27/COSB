const AWS = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');

const spacesEndpoint = new AWS.Endpoint(`https://${process.env.DO_REGION}.digitaloceanspaces.com`);
const s3 = new AWS.S3({
  endpoint: spacesEndpoint,
  accessKeyId: process.env.DO_SPACES_ACCESS_KEY,
  secretAccessKey: process.env.DO_SPACES_SECRET_KEY,
});

const uploadFile = async (req) => {
  if (!req.file) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'No file ');
  }
  const fileName = req.file.originalname;
  const params = {
    Bucket: process.env.DO_SPACES_NAME,
    Key: fileName,
    Body: req.file.buffer,
    ACL: 'public-read',
  };
  const uploadData = await s3.upload(params).promise();
  return uploadData.Location;
};

module.exports = {
  uploadFile,
};
