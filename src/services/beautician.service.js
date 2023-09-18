const httpStatus = require('http-status');
const { Beautician, Salon, Service, ServiceType, Rating } = require('../models');
const ApiError = require('../utils/ApiError');
const { mongoose } = require('../config/config');

const mongooseDb = require('mongoose');
const { populate } = require('../models/beautician.model');

const createBeautician = async (Beauticianbody) => {
  if (await Beautician.isEmailTaken(Beauticianbody.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  return Beautician.create(Beauticianbody);
};

const getBeautician = async () => {
  return await Beautician.find({});
};

const getBeauticianById = async (id) => {
  const beauticianId = mongooseDb.Types.ObjectId(id);

  // return await Beautician.findOne({ _id: beauticianId });

  return await Beautician.aggregate([
    {
      $match: { _id: beauticianId },
    },
    {
      $lookup: {
        from: 'salons',
        localField: '_id',
        foreignField: 'beautician',
        as: 'salon',
      },
    },
    {
      $unwind: '$salon',
    },
    {
      $lookup: {
        from: 'services',
        localField: 'salon._id',
        foreignField: 'salon',
        as: 'salon.services',
      },
    },
    {
      $group: {
        _id: '$_id',
        name: { $first: '$name' },
        email: { $first: '$email' },
        image: { $first: '$image' },
        createdAt: { $first: '$createdAt' },
        salons: { $push: '$salon' },
      },
    },
  ]);
};

const getSalonByBeauticianId = async (id) => {
  const beauticianId = mongooseDb.Types.ObjectId(id);

  return await Salon.find({ beautician: beauticianId });
};

const createSalon = async (salonBody) => {
  return await Salon.create(salonBody);
};

const createService = async (salonBody) => {
  return await Salon.create(salonBody);
};

const getsalon = async (searchBody) => {
  const { beautician, service, location, date, price, sort_price, service_type, rating } = searchBody;
  let service_typeId = '';
  if (service_type) {
    service_typeId = mongooseDb.Types.ObjectId(service_type);
  }

  // console.log(service_type);
  const matchCondition = [
    { 'beautician.name': { $regex: beautician, $options: 'i' } },
    { 'services.name': { $regex: service, $options: 'i' } },
    { address: { $regex: location, $options: 'i' } },
  ];

  if (date) {
    matchCondition.push({
      $or: [
        { morning: { $in: [date] } }, // Check if 'date' is in the 'morning' array
        { afternoon: { $in: [date] } }, // Check if 'date' is in the 'afternoon' array
      ],
    });
  }

  // filter
  if (price) {
    matchCondition.push({
      'services.price': {
        $gte: parseInt(price.split('-')[0]),
        $lte: parseInt(price.split('-')[1]),
      },
    });
  }

  if (rating) {
    matchCondition.push({
      avgRating: {
        $gt: parseInt(rating),
      },
    });
  }

  const aggregationPipeline = [
    {
      $lookup: {
        from: 'beauticians',
        localField: 'beautician',
        foreignField: '_id',
        as: 'beautician',
      },
    },
    {
      $unwind: '$beautician',
    },
    {
      $lookup: {
        from: 'services',
        localField: '_id',
        foreignField: 'salon',
        as: 'services',
      },
    },
    {
      $lookup: {
        from: 'salon_ratings',
        localField: '_id',
        foreignField: 'salon',
        as: 'rating',
      },
    },
    {
      $addFields: {
        ratingCount: { $size: '$rating' }, // Count the total ratings
        avgRating: {
          $avg: {
            $map: {
              input: '$rating',
              as: 'rating',
              in: '$$rating.rating',
            },
          },
        },
      },
    },
    {
      $project: {
        rating: 0, // Exclude the 'rating' field if you don't need it in the final result
      },
    },
    {
      $match: {
        $and: matchCondition,
      },
    },
  ];

  if (service_typeId) {
    // console.log(service_typeId);
    // Conditionally add the $match stage for service_type
    aggregationPipeline.push({
      $match: {
        'services.service_type': service_typeId,
      },
    });
  }

  if (sort_price === 'low') {
    aggregationPipeline.push({
      $sort: {
        'services.price': 1, // Sort in ascending order (low to high)
      },
    });
  } else {
    aggregationPipeline.push({
      $sort: {
        'services.price': -1, // Sort in descending order (high to low)
      },
    });
  }
  const salon = await Salon.aggregate(aggregationPipeline);

  return salon;
};

const getservice = async () => {
  return await Service.find().populate('salon').populate('service_type');
};

const getSalonById = async (id) => {
  const salonId = mongooseDb.Types.ObjectId(id);

  const salon = Salon.aggregate([
    {
      $match: { _id: salonId },
    },
    {
      $lookup: {
        from: 'beauticians',
        localField: 'beautician',
        foreignField: '_id',
        as: 'beautician',
      },
    },
    {
      $unwind: '$beautician',
    },
    {
      $lookup: {
        from: 'services',
        localField: '_id',
        foreignField: 'salon',
        as: 'services',
      },
    },
    {
      $lookup: {
        from: 'salon_ratings',
        localField: '_id',
        foreignField: 'salon',
        as: 'rating',
      },
    },
    {
      $addFields: {
        ratingCount: { $size: '$rating' }, // Count the total ratings
        avgRating: {
          $avg: {
            $map: {
              input: '$rating',
              as: 'rating',
              in: '$$rating.rating',
            },
          },
        },
      },
    },
    {
      $project: {
        rating: 0, // Exclude the 'rating' field if you don't need it in the final result
      },
    },
  ]);
  return salon;
};

const seachServiceSalaon = async (searchBody) => {
  console.log(searchBody.beauticians);

  Salon.find({ name: { $regex: new RegExp(searchBody.beauticians, 'i') } }, (err, results) => {
    if (err) {
      console.error(err);
      return;
    }

    return results;
  });
};

const createServiceType = async (serviceTypeBody) => {
  if (await ServiceType.isNameTaken(serviceTypeBody.name)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Service Type already exists');
  }
  return await ServiceType.create(serviceTypeBody);
};

const createSalonRating = async (ratingBody) => {
  const userId = mongooseDb.Types.ObjectId(ratingBody.user);
  const salonId = mongooseDb.Types.ObjectId(ratingBody.salon);

  const ratingExists = await Rating.find({
    $and: [
      {
        user: userId,
      },
      {
        salon: salonId,
      },
    ],
  });

  if (ratingExists.length > 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Rating already exists');
  }

  return await Rating.create(ratingBody);
};

const getSalonByBeautician = async (id) => {
  const beauticianId = mongooseDb.Types.ObjectId(id);
  const salon = Salon.aggregate([
    {
      $match: { beautician: beauticianId },
    },

    {
      $lookup: {
        from: 'services',
        localField: '_id',
        foreignField: 'salon',
        as: 'services',
      },
    },

    {
      $lookup: {
        from: 'salon_ratings',
        localField: '_id',
        foreignField: 'salon',
        as: 'rating',
      },
    },
    {
      $addFields: {
        ratingCount: { $size: '$rating' }, // Count the total ratings
        avgRating: {
          $avg: {
            $map: {
              input: '$rating',
              as: 'rating',
              in: '$$rating.rating',
            },
          },
        },
      },
    },
    {
      $project: {
        rating: 0, // Exclude the 'rating' field if you don't need it in the final result
      },
    },
  ]);

  return salon;
};

const getServiceBySalon = async (id) => {
  const salonId = mongooseDb.Types.ObjectId(id);

  return Service.find({salon:salonId}).populate('service_type').exec();
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
  createServiceType,
  getBeauticianById,
  getSalonByBeauticianId,
  createSalonRating,
  getSalonByBeautician,
  getServiceBySalon,
};
