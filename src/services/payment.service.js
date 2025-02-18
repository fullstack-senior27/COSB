// const { beauticianService, userService } = require('./index');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const beauticianService = require('./beautician.service')
const userService = require('./user.service');
const { Appointment } = require('../models');
const mongoose = require('mongoose')

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const createSeller = async (email) => {
  const account = await stripe.accounts.create({
    type: 'express',
    email: email,
  })
  // console.log(account);
  return account;
}

const generateAccountLink = async (beauticianId) => {
  let accountId;
  const beautician = await beauticianService.getBeauticianById(beauticianId);
  // const account = await createSeller();
  if (beautician.accountId !== "") {
    accountId = beautician.accountId;
  } else {
    const account = await createSeller(beautician.email)
    beautician.accountId = account.id;
    await beautician.save();
    accountId = account.id;
  }
  const link = await stripe.accountLinks.create({
    account: accountId,
    refresh_url: 'http://localhost:3000/v1/beautician/connect_account/create/failed',
    return_url: 'http://localhost:3000/v1/beautician/connect_account/create/success',
    type: 'account_onboarding',
  })
  return link
}

const processPayment = async (appointment, cardId) => {
  // console.log("appointment: ", appointment);
  if (appointment.paymentStatus === "paid") {
    throw new ApiError(httpStatus.CONFLICT, "Payment is already done for this appointment")
  }
  const cards = await stripe.customers.listSources(
    appointment.user.customerId,
    { object: 'card' }
  )
  const paymentIntent = await stripe.paymentIntents.create({
    amount: appointment.amount * 100,
    currency: 'usd',
    customer: appointment.user.customerId,
    // payment_method: cards.data[0].id,
    metadata: {
      appointment: appointment.id
    },
    payment_method: cardId,
    automatic_payment_methods: {
      enabled: true,
      allow_redirects: 'never'
    },
    // application_fee_amount: 123,
    // on_behalf_of: accountId
    transfer_data: {
      // amount: 877,
      destination: appointment.beautician.accountId
    },// You can set a fee for your platform
  },
  );
  // console.log("paymentIntent: ", paymentIntent);

  const confirmedPaymentIntent = await stripe.paymentIntents.confirm(
    paymentIntent.id
  )
  // appointment.paymentStatus = "paid";
  // await appointment.save();
  return confirmedPaymentIntent
}

// const createCard = async ({ card, type }) => {
//   const card = await stripe.customers.createSource(
//     ''
//   )

//   const paymentMethod = await stripe.paymentMethods.create({
//     type,
//     card
//   },)
//   console.log("card---->: ", paymentMethod)
//   return paymentMethod;
// }

const listAvailableCards = async (customerId) => {
  if (customerId === "") {
    return [];
  }
  let cards = await stripe.customers.listSources(
    customerId,
    { object: 'card' }
  )

  // if (cards.has_more) {
  //   cards = await stripe.customers.listSources(
  //     customerId,
  //     { object: 'card' }
  //   )
  // }
  return cards.data
}

const createCustomer = async ({ email, card }) => {
  const user = await userService.getUserByEmail(email);
  let customer;
  if (user && user.customerId !== "") {
    customer = await stripe.customers.retrieve(user.customerId);
  } else {
    customer = await stripe.customers.create({
      email,
    })
    user.customerId = customer.id;
    await user.save();
  }

  const { number, exp_month, exp_year, cvc } = card;
  const availableCards = await listAvailableCards(user.customerId);
  for (let c of availableCards) {
    if (c.last4 === number.slice(-4)) {
      throw new ApiError(httpStatus.CONFLICT, "You have already added this card")
    }
  }

  // console.log(user)
  // console.log(number);
  try {
    const cardToken = await stripe.tokens.create({
      card: {
        number,
        exp_month,
        exp_year,
        cvc,
      },
    })
    // console.log("card token: ", cardToken);
    const createdCard = await stripe.customers.createSource(user.customerId, { source: cardToken.id })
    return createdCard;
  } catch (error) {
    throw new ApiError(httpStatus.BAD_REQUEST, error.raw.message || "Error while adding your card!")
  }

}

const listAllPayments = async (accountId) => {
  // const limit = 10;
  let paymentIntents = await stripe.transfers.list({ destination: accountId });
  return paymentIntents;
}

const listAllBalanceTransactions = async (accountId) => {
  let balanceTransactions = await stripe.balanceTransactions.list({
    stripeAccount: accountId,
    limit: 100
  })
  let charges = balanceTransactions.data.filter(bt => bt.reporting_category === "charge")
  charges = charges.map(charge => ({
    ...charge,
    amount: charge.net / 100
  }));
  let payouts = balanceTransactions.data.filter(bt => bt.reporting_category === "payout")
  payouts = payouts.map(payout => ({
    ...payout,
    amount: payout.net / 100
  }));
  return {
    charges,
    payouts
  };
}

const createPayout = async (amount, bankAccountId, accountId) => {
  const payoutObj = await stripe.payouts.create({
    amount,
    currency: 'usd',
    method: 'instant',
    destination: bankAccountId
  }, {
    stripeAccount: accountId
  })

  // console.log()
  return payoutObj;
}

const listAllPayouts = async (accountId) => {
  const limit = 10
  let payouts = await stripe.payouts.list({
    stripeAccount: accountId,
    // limit: 100
  })
  while (payouts.has_more) {
    payouts = await stripe.payouts.list({
      starting_after: payouts.data[payouts.data.length - 1].id
    }, {
      stripeAccount: accountId
    })
  }
  // console.log(payouts);
  payouts = payouts.data.map(payout => ({
    ...payout,
    amount: payout.amount / 100,
    // totalPayout: 
  }));
  return payouts
}

const getTotalEarning = async (beauticianId) => {
  // const balance = await stripe.balance.retrieve({
  //   stripeAccount: accountId
  // })
  // const totalEarning = ((balance.available[0].amount + Math.abs(balance.pending[0].amount)) / 100).toFixed(2)
  console.log(beauticianId)
  const result = await Appointment.aggregate([
    {
      $match: {
        beautician: mongoose.Types.ObjectId(beauticianId),
        paymentStatus: 'paid',
      },
    },
    {
      $group: {
        _id: null,
        totalEarning: { $sum: '$amount' }, // Assuming there is a field named totalAmount in your Appointment schema
      },
    },
  ]);
  // console.log(result)
  return result[0].totalEarning.toString();
}



const getWithdrawBalance = async (accountId) => {
  const payouts = await listAllPayouts(accountId)
  let totalWithDrawBalance = 0;
  for (let payout of payouts) {
    totalWithDrawBalance += payout.amount
  }
  return totalWithDrawBalance.toFixed(2);
}

const deleteCard = async (cardId, customerId) => {
  const card = await stripe.customers.retrieveSource(
    customerId,
    cardId
  )
  if (!card) {
    throw new ApiError(httpStatus.NOT_FOUND, "Card not found");
  }
  const deleted = await stripe.customers.deleteSource(
    customerId,
    cardId
  )
  return deleted;
}

module.exports = {
  createSeller,
  generateAccountLink,
  processPayment,
  createCustomer,
  listAllPayments,
  createPayout,
  getTotalEarning,
  getWithdrawBalance,
  // getBalance,
  listAllBalanceTransactions,
  listAvailableCards,
  listAllPayouts,
  deleteCard
}