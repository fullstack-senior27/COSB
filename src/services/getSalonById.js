const { Salon, Service } = require('../models');
const mongooseDb = require('mongoose');

const getSalonById = async (id) => {
  // console.log(id);
  const salonId = mongooseDb.Types.ObjectId(id);

  const salon = await Salon.findOne({ _id: salonId }).populate('beautician').exec();

  const services = await Service.find({ salon: salonId });

  salon.jh = services;
  return salon;

  // console.log(salon);
  // const service = await Service.find({ salon: salonId });
};
