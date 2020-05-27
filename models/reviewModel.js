const mongoose = require('mongoose');
const Apartment = require('./apartmentModel');

const reviewSchema = new mongoose.Schema({
  review: {
    type: String,
    required: [true, 'Review can not be empty!'],
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
  },
  createAt: {
    type: Date,
    default: Date.now(),
  },
  apartment: {
    type: mongoose.Schema.ObjectId,
    ref: 'Apartment',
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },
});

reviewSchema.index(
  { apartment: 1, user: 1 },
  {
    unique: true,
  }
);

reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'name photo',
  });

  next();
});

reviewSchema.statics.calcAverageRatings = async function (apartmentId) {
  const stats = await this.aggregate([
    {
      $match: { apartment: apartmentId },
    },
    {
      $group: {
        _id: '$apartment',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);
  if (stats.length > 0) {
    await Apartment.findByIdAndUpdate(apartmentId, {
      ratingsQuantity: stats[0].nRating,
      ratingsAverage: stats[0].avgRating,
    });
  } else {
    await Apartment.findByIdAndUpdate(apartmentId, {
      ratingsQuantity: 0,
      ratingsAverage: 2.5,
    });
  }
};

reviewSchema.post('save', function () {
  this.constructor.calcAverageRatings(this.apartment);
});

reviewSchema.pre(/^findOneAnd/, async function (next) {
  this.r = await this.findOne();
  next();
});

reviewSchema.post(/^findOneAnd/, async function () {
  await this.r.constructor.calcAverageRatings(this.r.apartment);
});

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;
