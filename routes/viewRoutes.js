const express = require('express');
const viewController = require('../controllers/viewController');
const authController = require('../controllers/authController');
const BookingController = require('../controllers/bookingController');

const router = express.Router();

router.get(
  '/',
  BookingController.createBookingCheckout,
  authController.isLoggedIn,
  viewController.getOverview
);
router.get(
  '/apartment/:slug',
  authController.isLoggedIn,
  viewController.getApartment
);
router.get('/login', authController.isLoggedIn, viewController.getLoginForm);
router.get('/signup', viewController.getSignUpForm);
router.get('/me', authController.protect, viewController.getAccount);

router.get(
  '/my-bookings',
  authController.protect,
  viewController.getMyBookings
);
router.get(
  '/submit-user-data',
  authController.protect,
  viewController.updateUserData
);
router.get(
  '/my-apartments',
  authController.protect,
  viewController.getMyApartments
);
router.get(
  '/create-apartment',
  authController.protect,
  viewController.getCreateApartmentForm
);

router.get('/bookings', authController.protect, viewController.getBookings);

module.exports = router;
