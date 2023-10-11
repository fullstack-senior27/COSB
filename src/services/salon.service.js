const httpStatus = require('http-status');
const { User, Salon, Service, Rating, Review, Beautician } = require('../models');
const ApiError = require('../utils/ApiError');
const { filter } = require('../config/logger');
const mongoose = require('mongoose')

/*
{
  filters: {
    service: string,
    price_range: {
      minPrice: number,
      maxPrice: number
    },
    avgRating: {

    }
  }
}
price_range = {
  "min": number,
  "max": number
}
/**
 * Create a user
 * @returns {Promise<QueryResult>}
 */
const getAllSalons = async () => {
  const salons = await Salon.find().populate({
    path: 'reviews',
    populate: 'user'
  }).populate({
    path: 'services',
    populate: 'service_category'
  }).populate('service_categories').populate('beautician').exec();

  return salons
}
const getSalonById = async (salonId) => {
  console.log(salonId)
  const id = mongoose.Types.ObjectId(salonId);
  const salon = await Salon.aggregate([
    {
      $match: { _id: id },
    },
    {
      // $lookup: {
      //   from: 'ratings',
      //   localField: '_id',
      //   foreignField: 'salon',
      //   as: 'rating',
      // },
      $lookup: {
        from: 'reviews',
        localField: '_id',
        foreignField: 'salon',
        as: 'review'
      }
    },
    // {
    //   $lookup: {
    //     from: 'services',
    //     localField: '_id',
    //     foreignField: 'salon',
    //     as: 'services'
    //   }
    // },
    {
      $addFields: {
        ratingCount: { $size: '$review' }, // Count the total ratings
        avgRating: {
          $avg: {
            $map: {
              input: '$review',
              as: 'review',
              in: '$$review.rating',
            },
          },
        },
      },
    },
    {
      $project: {
        review: 0
      }
    }
  ])
  await Salon.populate(salon, {
    path: "services", populate: {
      path: 'service_category'
    }
  })
  await Salon.populate(salon, {
    path: "service_categories"
  })
  await Salon.populate(salon, {
    path: 'reviews', populate: {
      path: 'user'
    }
  })
  await Salon.populate(salon, 'beautician')

  return salon
}


const filterSalons = async (filters) => {
  if (Object.keys(filters).length === 0) {
    return [];
  }
  const { search, service_type, price_range, rating, address, owner_name, date } = filters;
  // const filterConditions = [
  //   { 'services.name': { $regex: service_name, $options: 'i' } }
  // ]
  // console.log(owner_name)
  const filterConditions = [
    {
      $or: [
        { 'beautician.firstName': { $regex: `${search}`, $options: 'i' } },
        { 'beautician.lastName': { $regex: `${search}`, $options: 'i' } },
        { 'services.name': { $regex: `${search}`, $options: 'i' } }
      ],
    },
    {
      'address': { $regex: `${address}`, $options: 'i' },
    }
  ]

  if (date) {
    filterConditions.push({
      $or: [
        { morning: { $in: [date] } },
        { afternoon: { $in: [date] } },
      ],
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
        from: 'users',
        localField: 'beautician',
        foreignField: '_id',
        as: 'beautician'
      }
    },
    {
      $lookup: {
        from: 'service_categories', // The name of the categories collection
        localField: 'service_categories', // Field from the 'Salon' collection
        foreignField: '_id', // Field from the 'Category' collection
        as: 'service_categories',
      },
    },
    {
      $lookup: {
        from: 'reviews',
        localField: '_id',
        foreignField: 'salon',
        as: 'reviews'
      }
      // $lookup: {
      //   from: 'reviews',
      //   localField: 'reviews',
      //   foreignField: '_id',
      //   as: 'reviews'
      // }
    },
    {
      $match: {
        $or: filterConditions
      },
    },
    {
      $unwind: '$beautician'
    }
  ]

  if (service_type) {
    aggregationPipeline.push({
      $match: {
        'service_categories.name': service_type, // Filter by service name
      },
    });
  }

  if (price_range) {
    aggregationPipeline.push({
      $match: {
        'services.price': {
          $gte: price_range.minPrice, // Replace with the minimum price value
          $lte: price_range.maxPrice, // Replace with the maximum price value
        },
      }
    })
  }
  // if (rating) {
  //   aggregationPipeline.push({
  //     $match: {
  //       'avgRating': {
  //         $gt: rating
  //       }

  //     }
  //   })
  // }

  const salons = await Salon.aggregate(aggregationPipeline)
  // console.log(salons)
  const newSalons = []
  const salonsWithAvgRating = salons.map((salon) => {
    const totalRating = salon.reviews.reduce((sum, review) => sum + review.rating, 0);
    console.log(totalRating);
    const avgRating = salon.reviews.length > 0 ? totalRating / salon.reviews.length : 0;

    return newSalons.push({
      ...salon,
      avgRating: avgRating.toFixed(2),
    });
  })
  console.log(salonsWithAvgRating);
  if (rating) {
    newSalons = newSalons.filter(salon => salon.avgRating >= rating);
  }
  return newSalons;
}

/*
services: {
  name: string,
  serviceType: [
    { name: string, price: number, duration: number, isAvailable: boolean }
  ]
}

*/

const createSalon = async ({ name, images, morning, afternoon, about, address, contact, services, service_categories }, userId) => {
  const existingSalon = await Salon.findOne({
    name
  })
  if (existingSalon) {
    throw new ApiError(httpStatus.CONFLICT, 'Salon name already exists', false)
  }
  console.log(userId);
  const beautician = await User.findById(userId);
  console.log("beautician -> ", beautician);
  if (!beautician) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Beautician not found', false)
  }
  const salon = new Salon({
    name,
    images,
    morning,
    afternoon,
    about,
    beautician: userId,
    address,
    contact,
    services,
    service_categories: service_categories, // service types
    reviews: []
  })



  const savedSalon = await salon.save();
  for (const s_id of services) {
    const foundService = await Service.findById(s_id)
    foundService.salon = savedSalon._id
    await foundService.save();
  }
  beautician.salons.push(savedSalon._id);
  await beautician.save();
  return savedSalon;

}

// const rateSalon = async (salon_id, cur_user, rating) => {
//   // console.log(cur_user);

//   // check if the user has already rated the salon
//   const existing_ratings = await Rating.findOne({
//     $and: [
//       { salon: salon_id },
//       { user: cur_user }
//     ]
//   });
//   console.log(existing_ratings)
//   if (existing_ratings) {
//     throw new ApiError(httpStatus.CONFLICT, 'You have already rated this salon.', false);
//   }
//   const createdRating = await Rating.create({
//     rating,
//     salon: salon_id,
//     user: cur_user.id
//   })
//   console.log(createdRating)
//   const updatedSalon = await Salon.findByIdAndUpdate(salon_id, {
//     $push: {
//       ratings: createdRating._id
//     },
//   }, {
//     new: true

//   })
//   return updatedSalon;
// }

const updateSalon = async (salon_id, updateBody, user) => {
  // const salon = await Salon.findById(salon_id);
  const salon = await Salon.findOne({
    _id: salon_id,
    beautician: user
  })
  console.log(salon);
  console.log(typeof salon)
  if (!salon) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Salon not found')
  }
  Object.assign(salon, updateBody)
  console.log(salon);
  await salon.save();
  console.log(salon);
  return salon

}

const reviewSalon = async (salon_id, cur_user, review_text, rating) => {
  // console.log(cur_user);

  // check if the user has already rated the salon
  const existing_review = await Review.findOne({
    $and: [
      { salon: salon_id },
      { user: cur_user._id }
    ]
  });
  console.log(existing_review)
  if (existing_review) {
    throw new ApiError(httpStatus.CONFLICT, 'You have already reviewed this salon.', false);
  }
  const createdReview = await Review.create({
    text: review_text,
    rating,
    salon: salon_id,
    user: cur_user._id
  })
  console.log(createdReview)
  const updatedSalon = await Salon.findByIdAndUpdate(salon_id, {
    $push: {
      reviews: createdReview._id
    },
  })
  console.log("updated salon: ", updatedSalon);
  return updatedSalon;
}

const deleteSalon = async (salon_id) => {
  const deletedSalon = await Salon.findByIdAndDelete(salon_id)
  return deletedSalon
}


module.exports = {
  filterSalons,
  getAllSalons,
  createSalon,
  // rateSalon,
  getSalonById,
  updateSalon,
  deleteSalon,
  reviewSalon
};
