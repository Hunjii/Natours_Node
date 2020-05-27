const Apartment = require('../models/apartmentModel');
const User = require('../models/userModel');
const Booking = require('../models/bookingModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Review = require('../models/reviewModel');

exports.getOverview = catchAsync(async (req, res, next) => {
  const apartments = await Apartment.find();

  res.status(200).render('overview', {
    title: 'All Apartment',
    apartments,
  });
});

exports.getApartment = catchAsync(async (req, res, next) => {
  const apartment = await Apartment.findOne({ slug: req.params.slug }).populate(
    {
      path: 'reviews',
      fields: 'review rating user',
    }
  );

  if (!apartment) {
    return next(new AppError('There is no apartment with that name!', 404));
  }

  res.status(200).render('apartment', {
    title: apartment.name,
    apartment,
    //isRented,
  });
});

exports.getLoginForm = (req, res) => {
  res.status(200).render('login', {
    title: 'Login on account',
  });
};

exports.getSignUpForm = (req, res) => {
  res.status(200).render('signup', {
    title: 'Sign Up',
  });
};

exports.getAccount = (req, res) => {
  res.status(200).render('account/accountSettings', {
    title: 'Login on account',
  });
};

exports.getMyBookings = catchAsync(async (req, res, next) => {
  // 1) Find all bookings with user login
  const bookings = await Booking.find({ user: req.user.id });

  // 2) Return all apartments with return IDs
  const ApartmentIDs = bookings.map((el) => el.apartment);
  const apartments = await Apartment.find({ _id: { $in: ApartmentIDs } });

  // 3) Return all review by user
  const apartmentIDsBooked = apartments.map((el) => el.id);
  const reviewsByUser = await Review.find({
    user: req.user.id,
    apartment: { $in: apartmentIDsBooked },
  }).select('user apartment');

  const reviewArray = reviewsByUser.map((el) => el.apartment.toString());

  res.status(200).render('overview', {
    title: 'My Bookings',
    apartments,
    reviewArray,
  });
});

exports.updateUserData = catchAsync(async (req, res) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    {
      name: req.body.name,
      email: req.body.email,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).render('account', {
    title: 'Login on account',
    updatedUser,
  });
});

exports.getMyApartments = catchAsync(async (req, res, next) => {
  const apartments = await Apartment.find({ host: req.user.id });

  res.status(200).render('account/myApartments', {
    title: 'Apartments',
    apartments,
  });
});

exports.getCreateApartmentForm = catchAsync(async (req, res, next) => {
  res.status(200).render('account/createApartment', {
    title: 'Create Apartment',
  });
});

exports.getBookings = catchAsync(async (req, res, next) => {
  const apartments = await Apartment.find({ host: req.user.id });

  const apartmentIds = apartments.map((el) => el._id);

  const bookings = await Booking.find({ apartment: { $in: apartmentIds } });

  res.status(200).render('account/booking', {
    title: 'Bookings',
    bookings,
  });
});
