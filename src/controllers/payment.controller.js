const httpStatus = require('http-status');
const ApiSuccess = require('../utils/ApiSuccess');
const catchAsync = require('../utils/catchAsync');
const { paymentService, appointmentService, transactionService } = require('../services');

const createSeller = catchAsync(async (req, res) => {
  // const account = await paymentService.createSeller();
  const accountLink = await paymentService.generateAccountLink(req.user._id);
  console.log(accountLink);
  return new ApiSuccess(res, httpStatus.CREATED, 'Success', accountLink);
});

const processPayment = catchAsync(async (req, res) => {
  const appointment = await appointmentService.getAppointmentById(req.body.appointmentId);
  const paymentIntent = await paymentService.processPayment(appointment, req.body.cardId);
  return new ApiSuccess(res, httpStatus.CREATED, 'Payment successfull', paymentIntent);
});

const createCustomer = catchAsync(async (req, res) => {
  // const card = await paymentService.createCard(req.body);
  // console.log("card === ", card)
  // return;
  // console.log(req.body);
  // const customer = await paymentService.createCustomer(req.body.type, req.body.email, req.body.card.number, req.body.card.exp_month, req.body.card.exp_year, req.body.card.cvc, req.body.accountId);
  const customer = await paymentService.createCustomer(req.body);
  return new ApiSuccess(res, httpStatus.CREATED, 'Customer added successfully', customer);
});

const listAllPayments = catchAsync(async (req, res) => {
  const paymentIntents = await paymentService.listAllPayments(req.user.accountId);
  return new ApiSuccess(res, httpStatus.OK, 'Payments listed successfully', paymentIntents);
});

const createPayout = catchAsync(async (req, res) => {
  const payoutObj = await paymentService.createPayout(req.body.amount, req.body.bankAccountId, req.body.accountId);
  return new ApiSuccess(res, httpStatus.CREATED, 'Payout successfull', payoutObj);
});

const getBalance = catchAsync(async (req, res) => {
  const transactions = await transactionService.getListOfTransactions(req.query.beauticianId);
  let totalEarning = 0;
  transactions.forEach((t) => {
    totalEarning += t.totalAmount;
  });
  let withdrawBalance = 0;
  const payouts = await paymentService.listAllPayouts(req.user.accountId);
  payouts.forEach((p) => {
    withdrawBalance += p.amount;
  });
  let remainingAmount = totalEarning - withdrawBalance;
  return new ApiSuccess(res, httpStatus.OK, 'Balance fetched successfully', {
    totalEarning,
    withdrawBalance,
    remainingAmount,
  });
});

const listBalanceTransactions = catchAsync(async (req, res) => {
  const balanceTransactions = await paymentService.listAllBalanceTransactions(req.user.accountId);
  return new ApiSuccess(res, httpStatus.OK, 'Balance Transactions', balanceTransactions);
});

const listCardsForUser = catchAsync(async (req, res) => {
  const cards = await paymentService.listAvailableCards(req.user.customerId);
  return new ApiSuccess(res, httpStatus.OK, 'Cards fetched successfully', cards);
});

const listAllPayouts = catchAsync(async (req, res) => {
  const payouts = await paymentService.listAllPayouts(req.user.accountId);
  return new ApiSuccess(res, httpStatus.OK, 'Payouts', payouts);
});

const deleteCard = catchAsync(async (req, res) => {
  const deleted = await paymentService.deleteCard(req.params.cardId, req.user.customerId);
  console.log(deleted);
  return new ApiSuccess(res, httpStatus.OK, 'Card deleted successfully', deleted);
});

module.exports = {
  createSeller,
  processPayment,
  createCustomer,
  listAllPayments,
  createPayout,
  getBalance,
  listBalanceTransactions,
  listCardsForUser,
  listAllPayouts,
  deleteCard,
};
