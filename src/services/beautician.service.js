const httpStatus = require('http-status');
const { Beautician } = require('../models');
const ApiError = require('../utils/ApiError');
const mongoose = require('mongoose');


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
}

const getBeauticianDetails = async (id) => {
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
        from: 'products',
        localField: 'products',
        foreignField: '_id',
        as: 'products'
      }
    },
    {
      $lookup: {
        from: 'service_categories',
        localField: 'service_categories',
        foreignField: '_id',
        as: 'service_categories'
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
        _id: mongoose.Types.ObjectId(id)
      }
    },
    {
      $project: {
        password: 0 // Exclude the password field
      }
    }
  ]
  console.log(id)
  const beautician = await Beautician.aggregate(aggregationPipeline);
  await Beautician.populate(beautician, [{
    path: 'services.service_type',
    model: 'Service_type'
  }, {
    path: 'services.service_category',
    model: 'Service_category'
  }, {
    path: 'reviews.user',
    model: 'User'
  }])
  return beautician[0];
  // return Beautician.findById(id).populate('services').populate('service_categories').populate('products').populate('reviews');
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
        from: 'products',
        localField: 'products',
        foreignField: '_id',
        as: 'products'
      }
    },
    {
      $lookup: {
        from: 'service_categories',
        localField: 'service_categories',
        foreignField: '_id',
        as: 'service_categories'
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
      $project: {
        password: 0 // Exclude the password field
      }
    }
  ]
  const beauticians = await Beautician.aggregate(aggregationPipeline);
  await Beautician.populate(beauticians, {
    path: 'services.service_type',
    model: 'Service_type'
  })
  return beauticians;
}

const filterBeauticians = async ({ search, location, date, price_range, service_type, service_category, sort_price, avgRating }) => {
  const matchConditions = [
    {
      $or: [
        {
          'name': { $regex: `${search}`, $options: 'i' }
        },
        {
          'services.name': { $regex: `${search}`, $options: 'i' }
        }
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
        from: 'products',
        localField: 'products',
        foreignField: '_id',
        as: 'products'
      }
    },
    {
      $lookup: {
        from: 'service_categories',
        localField: 'service_categories',
        foreignField: '_id',
        as: 'service_categories'
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
    {
      $project: {
        password: 0 // Exclude the password field
      }
    }
  ];


  const result = await Beautician.aggregate(aggregationPipeline);
  await Beautician.populate(result, {
    path: 'services.service_type',
    model: 'Service_type'
  })
  let filteredResults;
  if (price_range || service_type || service_category || sort_price || avgRating) {
    // console.log("--------------")
    // console.log(avgRating)
    let ratingCondition = true;
    let priceCondition = true;
    let categoryCondition = true;
    let typeCondition = true
    filteredResults = result.filter(beautician => {
      if (avgRating) {
        ratingCondition = beautician.avgRating === avgRating;
        // console.log("rating: ", ratingCondition)
      }
      if (price_range) {
        priceCondition = beautician.services.some(service => service.price >= price_range.minPrice && service.price <= price_range.maxPrice)
        // console.log(priceCondition)
      }
      if (service_category) {
        categoryCondition = beautician.service_categories.some(service => {
          return service.name === service_category;
        });
      }
      if (service_type) {
        typeCondition = beautician.services.some(service => service.service_type.name === service_type);
      }
      // if(sort_price) {
      //   const sortCondition = beautician.services.some()
      // }
      return ratingCondition && priceCondition && categoryCondition && typeCondition;
    });
    // console.log(priceCondition)
    // console.log(ratingCondition)
    // console.log(filteredResults);
    if (sort_price) {
      filteredResults.sort((a, b) => {
        // Assuming the price is in the services array, adjust the property accordingly
        const priceA = a.services[0].price;
        const priceB = b.services[0].price;

        return sort_price === "asc" ? priceA - priceB : priceB - priceA;// Adjust the sorting logic as needed
      });
    }
  } else {
    filteredResults = result;
  }



  return filteredResults;
}



module.exports = {
  createBeautician,
  updateBeauticianById,
  getBeauticianById,
  getBeauticianByEmail,
  updateBeauticianById,
  deleteBeauticianById,
  getAllBeauticians,
  filterBeauticians,
  getBeauticianDetails
};
