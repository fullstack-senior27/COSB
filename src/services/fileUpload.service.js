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
  console.log(req.files);
  if (!req.files || req.files.length === 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'No files uploaded');
  }

  const files = req.files;
  const errors = [];
  const uploadedUrls = [];

  const uploadPromises = files.map(async (file) => {
    const allowedTypes = ['image/jpeg', 'image/png'];
    const maxSize = 20 * 1024 * 1024; // 20MB

    if (!allowedTypes.includes(file.mimetype)) {
      errors.push(`Invalid file type: ${file.originalname}`);
      return;
    }

    if (file.size > maxSize) {
      errors.push(`File too large: ${file.originalname}`);
      return;
    }

    const params = {
      Bucket: process.env.DO_SPACES_NAME,
      Key: file.originalname.replace(/[\s-]/g, ''),
      Body: file.buffer,
      ACL: 'public-read',
    };

    try {
      const uploadData = await s3.upload(params).promise();
      console.log(`File uploaded: ${file.originalname}`);
      uploadedUrls.push(uploadData.Location);
    } catch (error) {
      console.error(`Error uploading file ${file.originalname}:`, error);
      errors.push(`Error uploading file ${file.originalname}`);
    }
  });
  await Promise.all(uploadPromises);

  if (errors.length > 0) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, errors);
  }

  return uploadedUrls;
};

module.exports = {
  uploadFile,
};
