const { Transaction } = require('../models');

const getListOfTransactions = async (beauticianId) => {
  const transactions = await Transaction.find({ beautician: beauticianId });
  return transactions;
};

module.exports = {
  getListOfTransactions,
};
