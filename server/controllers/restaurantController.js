const Restaurant = require('../models/restaurantModel');
const APIFeatures = require('../utils/apiFeatures');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.getAllRestaurants = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Restaurant.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const restaurants = await features.query;
  const totalResults = await Restaurant.countDocuments(features.queryObj);
  //  SEND RESPONSE
  res.status(200).json({
    status: 'success',
    totalResults,
    results: restaurants.length,
    data: {
      restaurants
    }
  });
});

exports.getRestaurant = catchAsync(async (req, res, next) => {
  const restaurant = await Restaurant.findById(req.params.id);

  if (!restaurant)
    return next(new AppError('رستورانی با شناسه درخواستی یافت نشد', 404));

  res.status(200).json({
    status: 'success',
    data: {
      restaurant
    }
  });
});

exports.createRestaurant = catchAsync(async (req, res, next) => {
  const restaurant = await Restaurant.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      restaurant
    }
  });
});

exports.updateRestaurant = catchAsync(async (req, res, next) => {
  const restaurant = await Restaurant.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true
    }
  );

  if (!restaurant)
    return next(new AppError('رستورانی با شناسه درخواستی یافت نشد', 404));

  res.status(200).json({
    status: 'success',
    data: {
      restaurant
    }
  });
});

exports.deleteRestaurant = catchAsync(async (req, res, next) => {
  const restaurant = await Restaurant.findByIdAndDelete(req.params.id);

  if (!restaurant)
    return next(new AppError('رستورانی با شناسه درخواستی یافت نشد', 404));

  res.status(204).json({
    status: 'success',
    data: null
  });
});

exports.getRestaurantBySlug = catchAsync(async (req, res, next) => {
  const restaurant = await Restaurant.findOne({ slug: req.params.slug });

  if (!restaurant) {
    return next(new AppError('رستورانی با نام درخواستی یافت نشد', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      restaurant
    }
  });
});
