const stripe = require('stripe')(process.env.STRIPE_SERCET_KEY);
const Apartment = require('../models/apartmentModel');
const Booking = require('../models/bookingModel');
const factory = require('./handleFactory');
// const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  // 1) Get the currently booked apartment
  const apartment = await Apartment.findById(req.params.apartmentId);

  // 2) Create checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    success_url: `${req.protocol}://${req.get('host')}/?apartment=${
      req.params.apartmentId
    }&user=${req.user.id}&price=${apartment.price.priceCommon}`,
    cancel_url: `${req.protocol}://${req.get('host')}/apartment/${
      apartment.slug
    }`,
    customer_email: req.user.email,
    client_reference_id: req.params.apartmentId,
    line_items: [
      {
        name: `${apartment.name}`,
        description: apartment.summary,
        images: [`https://www.natours.dev/img/tours/${apartment.imageCover}`],
        amount: apartment.price.priceCommon,
        currency: 'vnd',
        quantity: 1,
      },
    ],
  });

  // 3) Create session as response
  res.status(200).json({
    status: 'success',
    session,
  });
});

exports.createBookingCheckout = catchAsync(async (req, res, next) => {
  const { apartment, user, price } = req.query;

  if (!apartment && !user && !price) return next();
  await Booking.create({ apartment, user, price });

  res.redirect(req.originalUrl.split('?')[0]);
});

exports.createBooking = factory.createOne(Booking);
exports.getBooking = factory.getOne(Booking);
exports.getAllBookings = factory.getAll(Booking);
exports.updateBooking = factory.updateOne(Booking);
exports.deleteBooking = factory.deleteOne(Booking);
