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
  return Beautician.findById(id).populate('services').populate('service_categories').populate('products').populate('reviews');
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
  const beauticians = await Beautician.find();
  return beauticians;
}

const filterBeauticians = async (search, location, date, price_range, service_type, sort_price, avgRating) => {
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
      'address': { $regex: `${location}`, $options: 'i' }
    }
  ];

  if (date) {
    const startDate = new Date(date);
    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);
    matchConditions.push(
      {
        $and: [
          {
            "availability": {
              $elemMatch: {
                "date": {
                  $gte: startDate,
                  $lte: endDate
                }
              }
            }
          },
          { "availability.isAvailable": { $eq: true } },
        ]
      });
  }

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
      $lookup: {
        from: 'reviews',
        localField: 'reviews',
        foreignField: '_id',
        as: 'reviews'
      }
    },
    {
      $addFields: {
        ratingCount: { $size: '$reviews.rating' }, // Count the total ratings
        avgRating: {
          $avg: {
            $map: {
              input: '$reviews',
              as: 'review',
              in: '$$review.rating',
            },
          },
        },
      },
    },
    {
      $match: {
        $or: matchConditions
      }
    },
    // {
    //   $unwind: "$services"
    // },
    // {
    //   $unwind: '$reviews'
    // }
  ];

  const example = await Beautician.aggregate(aggregationPipeline);
  console.log(example)
  // Apply additional filters (e.g., price range and rating) to the existing pipeline
  if (price_range) {
    const { minPrice, maxPrice } = price_range;
    aggregationPipeline.push({
      $match: {
        "services.price": { $gte: minPrice, $lte: maxPrice }
      }
    });
  }

  if (avgRating) {
    aggregationPipeline.push({
      $match: {
        avgRating: { $eq: avgRating }
      }
    });
  }

  // Apply sorting if needed
  if (sort_price) {
    if (sort_price === 'asc') {
      aggregationPipeline.push({
        $sort: { "services.price": 1 }
      });
    } else {
      aggregationPipeline.push({
        $sort: { "services.price": -1 }
      });
    }
  }

  const result = await Beautician.aggregate(aggregationPipeline);
  await Beautician.populate(result, {
    path: 'services.service_type',
    model: 'Service_type'
  })
  const finalResults = []
  if (service_type) {
    for (let res of result) {
      for (let service of res.services) {
        if (service.service_type.name.localeCompare(service_type, "en", { sensitivity: "base" }) === 0) {
          finalResults.push(res);
        }
      }
    }
    return finalResults;
  }
  return result;
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
