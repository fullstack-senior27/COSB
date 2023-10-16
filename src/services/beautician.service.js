const httpStatus = require('http-status');
const { Beautician } = require('../models');
const ApiError = require('../utils/ApiError');


const createBeautician = async (beauticianBody) => {
  if (await Beautician.isEmailTaken(beauticianBody.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }

  if (await Beautician.isPhoneNoTaken(beauticianBody.phone)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Phone Number already taken');
  }
  return Beautician.create(beauticianBody);
};


const getBeauticianById = async (id) => {
  return Beautician.findById(id);
};


const getBeauticianByEmail = async (email) => {
  return Beautician.findOne({ email });
};


const updateBeauticianById = async (beauticianId, updateBody) => {
  const beautician = await getBeauticianById(beauticianId);
  if (!beautician) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found', false);
  }
  if (updateBody.email && (await Beautician.isEmailTaken(updateBody.email, beauticianId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  Object.assign(beautician, updateBody);
  await beautician.save();
  return beautician;
};


const deleteBeauticianById = async (beauticianId) => {
  const beautician = await getBeauticianById(beauticianId);
  if (!beautician) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Beautician not found');
  }
  await beautician.remove();
  return beautician;
};

const getAllBeauticians = async () => {
  const beauticians = await Beautician.find().populate('services').populate({
    path: 'services',
    populate: 'service_category'
  });
  return beauticians;
}

const filterBeauticians = async (search, location, date, price_range, service_type) => {
  const matchConditions = [
    {
      $or: [
        {
          'name': { $regex: `${search}`, $options: 'i' }
        },
        {
          'services.name': { $regex: `${search}`, $options: 'i' }
        },
      ]
    },
    {
      address: { $regex: `${location}`, $options: 'i' }
    }
  ]
  const aggregationPipeline = [
    {
      $lookup: {
        from: 'services',
        localField: 'services',
        foreignField: '_id',
        as: 'services'
      }
    },
    {
      $match: {
        $and: matchConditions
      }
    }
  ]
  const beauticians = Beautician.aggregate(aggregationPipeline);
  return beauticians;
}

module.exports = {
  createBeautician,
  updateBeauticianById,
  getBeauticianById,
  getBeauticianByEmail,
  updateBeauticianById,
  deleteBeauticianById,
  getAllBeauticians,
  filterBeauticians
};
