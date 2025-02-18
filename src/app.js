const express = require('express');
const helmet = require('helmet');
const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');
const compression = require('compression');
const cors = require('cors');
const passport = require('passport');
const httpStatus = require('http-status');
const config = require('./config/config');
const morgan = require('./config/morgan');
const { jwtStrategy, beauticianJwtStrategy, adminJwtStrategy } = require('./config/passport');
const { authLimiter } = require('./middlewares/rateLimiter');
const routes = require('./routes/v1');
const { errorConverter, errorHandler } = require('./middlewares/error');
const ApiError = require('./utils/ApiError');
const { sendEmail } = require('./services/email.service');
const { Appointment, Beautician, Transaction } = require('./models');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const app = express();

if (config.env !== 'test') {
  app.use(morgan.successHandler);
  app.use(morgan.errorHandler);
}

// set security HTTP headers
app.use(helmet());
app.post('/webhook', express.raw({ type: 'application/json' }), async (request, response) => {
  const payloadString = request.body;
  // console.log("payload (request): ", payloadString)
  // let endpointSecret = "whsec_a74da2b3b263ce7c8f5674096033a0e1876816db54c534dd45ca0c0ed6f5b817"
  let endpointSecret = process.env.STRIPE_WEBHOOK_KEY;
  const sig = request.headers['stripe-signature'];
  // console.log(sig.toString());

  let event;

  try {
    event = stripe.webhooks.constructEvent(payloadString, sig, endpointSecret);
  } catch (err) {
    return;
  }

  const paymentIntent = event.data.object;
  // console.log(paymentIntent);
  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      console.log('payment intent succeeded*****************');
      console.log(event.data.object.metdata);
      break;
    case 'transfer.created':
      console.log('transfer created*****************');
      console.log(event.data.object);
      break;
    case 'charge.succeeded':
      // console.log(paymentIntent)
      console.log('succeeded: ****************************');
      console.log('Charge: ', event.data.object);
      const charge = event.data.object;
      const appointment = await Appointment.findById(charge.metadata.appointment);
      appointment.paymentStatus = 'paid';
      await appointment.save();
      await Transaction.create({
        beautician: appointment.beautician,
        fee: charge.amount / 100,
        tip: 0,
        paymentMethod: charge.payment_method_details.card.funding,
        bookingDateTime: {
          timeSlot: appointment.timeSlot,
          date: appointment.date,
        },
        status: 'paid',
        appointment: appointment._id,
        totalAmount: charge.amount / 100 + 0,
      });
      sendEmail(charge.receipt_email, 'Payment Receipt', 'Click on the link to get the receipt', charge.receipt_url);
      break;
    // ... handle other event types
    case 'charge.failed':
      console.log('Charge failed');
      console.log(event.type.object);
    case 'payment_intent.canceled':
      console.log('Payment Intent cancelled');
      break;

    case 'payment_intent.requires_action':
      console.log(event.type.object);
      console.log('Payment Intent requires action');
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a 200 response to acknowledge receipt of the event
  response.send({
    message: 'Email sent',
  });
});

// parse json request body
app.use(express.json());

//store image as static file
app.use(express.static('public'));

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// sanitize request data
app.use(xss());
app.use(mongoSanitize());

// gzip compression
app.use(compression());

// enable cors
app.use(cors());
app.options('*', cors());

// jwt authentication
app.use(passport.initialize());
passport.use('jwt', jwtStrategy);
passport.use('beauticianJwt', beauticianJwtStrategy);
passport.use('adminJwt', adminJwtStrategy);

// require('./utils/cronJob').start();

// limit repeated failed requests to auth endpoints
if (config.env === 'production') {
  app.use('/v1/auth', authLimiter);
}

// v1 api routes
app.use('/v1', routes);
// app.use(express.raw({ type: '*/*' }));

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
});

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);

module.exports = app;
