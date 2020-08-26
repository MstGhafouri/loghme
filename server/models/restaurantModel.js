const mongoose = require('mongoose');
const slugify = require('../utils/slugifyPersian');

const restaurantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      unique: true,
      required: [true, 'فیلد نام رستوران الزامی است'],
      minlength: [2, 'طول نام رستوران نمی‌تواند کمتر از دو کاراکتر باشد'],
      maxlength: [100, 'طول نام رستوران نمی‌تواند بیشتر از صد کاراکتر باشد']
    },
    slug: String,
    logo: {
      type: String,
      required: [true, 'فیلد لگو رستوران الزامی است']
    },
    location: {
      x: {
        type: Number,
        required: [true, 'فیلد لوکیشن رستوران‌ الزامی است']
      },
      y: {
        type: Number,
        required: [true, 'فیلد لوکیشن رستوران‌ الزامی است']
      }
    },
    createdAt: {
      type: Date,
      default: Date.now()
    },
    menu: [
      {
        name: {
          type: String,
          trim: true,
          required: [true, 'فیلد نام غذا الزامی است'],
          minlength: [2, 'طول نام غذا نمی‌تواند کمتر از دو کاراکتر باشد']
        },
        description: {
          type: String,
          trim: true
        },
        image: {
          type: String,
          required: [true, 'فیلد تصویر غذا الزامی است']
        },
        price: {
          type: Number,
          required: [true, 'فیلد قیمت غذا الزامی است'],
          min: [0, 'قیمت غذا نمی‌تواند کمتر از صفر باشد']
        },
        oldPrice: {
          type: Number,
          min: [0, 'قیمت قبلی غذا نمی‌تواند کمتر از صفر باشد']
        },
        count: {
          type: Number,
          min: [0, 'موجودی یک غذا نمی‌تواند کمتر از صفر باشد']
        },
        popularity: {
          type: Number,
          default: 0.5,
          min: [0, 'فیلد محبوبیت یک غذا نمی‌تواند کمتر از صفر باشد'],
          max: [1, 'فیلد محبوبیت یک غذا نمی‌تواند بیشتر از یک باشد']
        },
        createdAt: {
          type: Date,
          default: Date.now()
        }
      }
    ]
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// DOCUMENT MIDDLEWARES
restaurantSchema.pre('save', function (next) {
  this.slug = slugify(this.name);
  next();
});

const Restaurant = mongoose.model('Restaurant', restaurantSchema);

module.exports = Restaurant;
