const Restaurant = require('../models/restaurantModel');
const APIFeatures = require('../utils/apiFeatures');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const fetchResources = require('../utils/fetchResources');

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

  // Remove food parties from the restaurant's menu
  restaurant.menu = restaurant.menu.filter(food => !food.oldPrice);

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

let startTime;
const INTERVAL = 60 * 60 * 1000; // 60 minutes
let foodParties = [];
let isTimeFinished = false;

const fetchFoodParties = async () => {
  isTimeFinished = true;
  const response = await fetchResources('foodparty');
  // eslint-disable-next-line no-unused-vars
  foodParties = response.map(({ id, ...item }) => item);
  // eslint-disable-next-line no-restricted-syntax
  for (const restaurant of foodParties) {
    // eslint-disable-next-line no-await-in-loop
    const doesRestaurantExist = await Restaurant.exists({
      name: restaurant.name
    });

    // If restaurant does not exist, add it to the database
    if (!doesRestaurantExist) {
      // eslint-disable-next-line no-await-in-loop
      await Restaurant.create(restaurant);
    }
  }
  startTime = new Date().getTime();
  isTimeFinished = false;
  foodParties = [];
};

fetchFoodParties();
setInterval(fetchFoodParties, INTERVAL);

exports.getFoodParties = catchAsync(async (req, res, next) => {
  if (!isTimeFinished && foodParties.length === 0) {
    // 1. First find all restaurants which have at least one foodParty
    const restaurants = await Restaurant.find({
      'menu.oldPrice': { $exists: true, $ne: null }
    });
    // 2. Loop through the restaurants and filter those which are 30 minutes old
    restaurants.forEach(restaurant => {
      restaurant.menu = restaurant.menu.filter(
        food =>
          food.oldPrice &&
          new Date().getTime() - new Date(food.createdAt).getTime() < INTERVAL
      );
    });
    // 3. Filter empty menus
    foodParties = restaurants.filter(
      restaurant => restaurant.menu.length !== 0
    );
  }

  if (!isTimeFinished)
    return res.status(200).json({
      status: 'success',
      results: foodParties.length,
      data: {
        restaurants: foodParties
      }
    });

  res.status(200).json({
    status: 'success',
    results: 0,
    data: {
      restaurants: []
    }
  });
});

exports.getRemainingTime = (req, res, next) => {
  res.status(200).json({
    status: 'success',
    data: {
      remaining: startTime
    }
  });
};
