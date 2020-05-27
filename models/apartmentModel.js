const mongoose = require('mongoose');
const slugify = require('slugify');

const apartmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      //required: [true, 'A apartment must have name'],
      unique: true,
      trim: true,
      maxlength: [
        100,
        'A apartment name must have less or equal 100 characters',
      ],
      minlength: [10, 'A apartment name must have more or equal 10 character'],
    },
    slug: String,
    summary: {
      type: String,
      trim: true,
      //required: [true, 'A apartment must have sumary'],
    },
    description: {
      type: String,
      trim: true,
      //required: [true, 'A apartment must have description'],
    },
    imageCover: String,
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    typeAparment: {
      type: String,
      //required: [true, 'A apartment must have typeAparment'],
      enum: {
        values: ['Căn hộ', 'Biệt thự', 'Studio', 'Nhà riêng'],
        message: 'Value of typeApartment was wrong',
      },
    },
    typeRoom: {
      type: String,
      //required: [true, 'A apartment must have typeRoom'],
      enum: {
        values: ['Nguyên căn', 'Phòng riêng'],
        message: 'Typed was wrong',
      },
    },
    countRoom: {
      bedroom: {
        type: Number,
        default: 1,
        min: [1, 'bedroom must be above 1'],
        max: [10, 'bedroom must be below 10'],
      },
      bathroom: {
        type: Number,
        default: 1,
        min: [1, 'bathroom must be above 1'],
        max: [10, 'bathroom must be below 10'],
      },
      bed: {
        type: Number,
        default: 1,
        min: [1, 'bed must be above 1'],
        max: [10, 'bed must be below 10'],
      },
    },
    ratingsAverage: {
      type: Number,
      min: 1,
      max: 5,
      default: 2.5,
      set: (val) => Math.round(val * 10) / 10,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    area: {
      type: Number,
      //required: [true, 'A apartment must have area'],
    },
    rules: {
      type: String,
      trim: true,
    },
    userManual: {
      type: String,
      trim: true,
    },
    price: {
      priceCommon: {
        type: Number,
        //required: [true, 'A tour must have a price'],
      },
      priceWeekend: {
        type: Number,
        //required: [true, 'A tour must have a price'],
      },
      priceDiscount: {
        priceweekend: {
          type: Number,
        },
      },
    },
    guestNumber: {
      type: Number,
      //required: [true, 'A tour must have a guestNumber'],
    },
    convenient: {
      aircondition: Boolean,
      tv: Boolean,
      wifi: Boolean,
      internet: Boolean,
      elevator: Boolean,
      washingmachine: Boolean,
      fridge: Boolean,
      pool: Boolean,
      balcony: Boolean,
    },
    location: {
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
    host: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes
apartmentSchema.index({ location: '2dsphere' });

// Virtual populate
apartmentSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'apartment',
  localField: '_id',
});

// Document middleware : run before save() and create()
apartmentSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

apartmentSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'host',
    select: '-__v -passwordChangedAt',
  });

  next();
});

// Query middleware

// Aggregation middleware

const Apartment = mongoose.model('Apartment', apartmentSchema);

module.exports = Apartment;
