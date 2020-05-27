const express = require('express');
const apartmentController = require('../controllers/apartmentController');
const authController = require('../controllers/authController');
const reviewRoutes = require('./reviewRoutes');

const router = express.Router();

router.use('/:apartmentId/reviews', reviewRoutes);

router
  .route('/')
  .get(apartmentController.getAllApartments)
  .post(
    authController.protect,
    authController.restrictTo('host'),
    apartmentController.uploadApartmentImages,
    apartmentController.resizeApartmentImages,
    apartmentController.createApartment
  );

router
  .route('/:id')
  .get(apartmentController.getApartment)
  .patch(
    authController.protect,
    authController.restrictTo('host'),
    apartmentController.uploadApartmentImages,
    apartmentController.resizeApartmentImages,
    apartmentController.updateApartment
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin'),
    apartmentController.deleteApartment
  );

router
  .route('/apartments-within/:distance/center/:latlng/unit/:unit')
  .get(apartmentController.getApartmentsWithin);

router
  .route('/distances/:latlng/unit/:unit')
  .get(apartmentController.getDistances);

module.exports = router;
