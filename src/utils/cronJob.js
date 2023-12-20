const cron = require('node-cron');
const { Beautician } = require('../models');

const cronJob = cron.schedule('0 0 * * *', async () => {
  try {
    // Get all beauticians
    const beauticians = await Beautician.find();

    beauticians.forEach(async (beautician) => {
      beautician.availableDays.forEach((availableDay) => {
        availableDay.date = new Date();
      });

      await beautician.save();
    });
    console.log('Daily update completed successfully');
  } catch (error) {
    console.error('Error during daily update:', error);
  }
});

module.exports = cronJob;