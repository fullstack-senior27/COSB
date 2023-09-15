const httpStatus = require('http-status');
const { Beautician, Salon, Service } = require('../models');
const ApiError = require('../utils/ApiError');
const { mongoose } = require('../config/config');

const mongooseDb = require('mongoose');

const createBeautician = async (Beauticianbody) => {
  if (await Beautician.isEmailTaken(Beauticianbody.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  return Beautician.create(Beauticianbody);
};

const getBeautician = async () => {
  return await Beautician.find({});
};

const createSalon = async (salonBody) => {
  return await Salon.create(salonBody);
};

const createService = async (salonBody) => {
  return await Salon.create(salonBody);
};

const getsalon = async () => {
  return await Salon.aggregate([
    {
      $lookup: {
        from: 'services',
        localField: '_id',
        foreignField: 'salons_id',
        as: 'services',
      },
    },
  ]);
};

const getservice = async () => {
  // return await Service.find({});

  return await Service.aggregate([
    {
      $lookup: {
        from: 'salons',
        localField: 'salons_id',
        foreignField: '_id',
        as: 'salon',
      },
    },
    {
      $lookup: {
        from: 'service_types',
        localField: 'serivce_type_id',
        foreignField: '_id',
        as: 'service_type',
      },
    },
  ]);
};

const getSalonById = async (id) => {
  // console.log(id);
  return await Salon.aggregate([
    {
      $match: {
        _id: new mongooseDb.Types.ObjectId(id),
      },
    },
    {
      $lookup: {
        from: 'services',
        localField: '_id',
        foreignField: 'salons_id',
        as: 'services',
      },
    },
    {
      $lookup: {
        from: 'service_types',
        localField: 'services.serivce_type_id',
        foreignField: '_id',
        as: 'service_type',
      },
    },
  ]);
};

const seachServiceSalaon = async (searchBody) => {
  // console.log(searchBody);
  // const { beauticians, service, location, date } = searchBody;

  console.log(searchBody.beauticians);

  Salon.find({ name: { $regex: new RegExp(searchBody.beauticians, 'i') } }, (err, results) => {
    if (err) {
      console.error(err);
      return;
    }

    return results;
  });
};

module.exports = {
  createBeautician,
  getBeautician,
  createSalon,
  getsalon,
  createService,
  getservice,
  getSalonById,
  seachServiceSalaon,
};
