const mongoose = require('mongoose');

const bookingSchema = mongoose.Schema({
  apartment: {
    type: mongoose.Schema.ObjectId,
    ref: 'Apartment',
    require: [true, 'Booking must belong to a Apartment'],
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    require: [true, 'Booking must belong to a User'],
  },
  price: {
    type: Number,
    require: [true, 'Booking must have a price'],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  paid: {
    type: Boolean,
    default: true,
  },
});

bookingSchema.pre(/^find/, function (next) {
  this.populate('user').populate({
    path: 'apartment',
    select: 'name location',
  });
  next();
});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
