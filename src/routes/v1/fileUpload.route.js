const express = require('express');
const multer = require('multer');

const httpStatus = require('http-status');
const { fileUploadService } = require('../../services');
const { fileUploadController } = require('../../controllers');

const router = express.Router();
const upload = multer();

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'uploads/');
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + '-' + file.originalname);
//   }
// });

// router.post('/', upload.single('file'), async (req, res) => {
//   // try {
//   //   if (!req.file) {
//   //     return res.status(400).send('No file uploaded.');
//   //   }
//   //   const fileLocation = fileUploadController.uploadFile(req.file);
//   //   if (!fileLocation) {
//   //     throw new Error('File upload failed or no location returned.');
//   //   }
//   //   res.json({
//   //     status: httpStatus.OK,
//   //     isSuccess: true,
//   //     location: fileLocation
//   //   });
//   // } catch (error) {
//   //   console.error('Error uploading file:', error);
//   //   res.status(500).send('Error uploading file.');
//   // }
// });

router.post('/', upload.single('file'), fileUploadController.uploadFile);

module.exports = router;
