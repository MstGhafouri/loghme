const mongoose = require('mongoose');
const Order = require('../models/orderModel');
const APIFeatures = require('../utils/apiFeatures');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.getMyOrders = catchAsync(async (req, res, next) => {
  const userOrders = await Order.aggregate([
    {
      $match: {
        user: mongoose.Types.ObjectId(req.user.id)
      }
    },
    {
      $unwind: { path: '$cartItems' }
    },
    {
      $lookup: {
        from: 'restaurants',
        localField: 'restaurant',
        foreignField: '_id',
        as: 'restaurantInfo'
      }
    },
    {
      $unwind: { path: '$restaurantInfo' }
    },
    {
      $project: {
        _id: 1,
        totalPrice: 1,
        status: 1,
        restaurantId: '$restaurant',
        restaurantName: '$restaurantInfo.name',
        date: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        quantity: '$cartItems.quantity',
        items: {
          $filter: {
            input: '$restaurantInfo.menu',
            as: 'item',
            cond: { $eq: ['$$item._id', '$cartItems.itemId'] }
          }
        }
      }
    },
    {
      $unwind: { path: '$items' }
    },
    {
      $group: {
        _id: '$_id',
        totalPrice: { $first: '$totalPrice' },
        status: { $first: '$status' },
        restaurantId: { $first: '$restaurantId' },
        restaurantName: { $first: '$restaurantName' },
        date: { $first: '$date' },
        cartItems: {
          $push: {
            name: '$items.name',
            price: '$items.price',
            type: {
              $cond: [
                { $eq: [{ $ifNull: ['$items.oldPrice', null] }, null] },
                'food',
                'foodParty'
              ]
            },
            quantity: '$quantity'
          }
        }
      }
    }
  ]);

  res.status(200).json({
    status: 'success',
    results: userOrders.length,
    data: {
      orders: userOrders
    }
  });
});

exports.createOrder = catchAsync(async (req, res, next) => {
  const order = await Order.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      order
    }
  });
});

exports.getOrder = catchAsync(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order)
    return next(new AppError('سفارشی با شناسه درخواستی یافت نشد', 404));

  res.status(200).json({
    status: 'success',
    data: {
      order
    }
  });
});

exports.getAllOrders = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Order.find(), req.query)
    .filter()
    .sort()
    .limitFields();

  const orders = await features.query;
  //  SEND RESPONSE
  res.status(200).json({
    status: 'success',
    results: orders.length,
    data: {
      orders
    }
  });
});

exports.updateOrder = catchAsync(async (req, res, next) => {
  const order = await Order.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!order)
    return next(new AppError('سفارشی با شناسه درخواستی یافت نشد', 404));

  res.status(200).json({
    status: 'success',
    data: {
      order
    }
  });
});

exports.deleteOrder = catchAsync(async (req, res, next) => {
  const order = await Order.findByIdAndDelete(req.params.id);

  if (!order)
    return next(new AppError('سفارشی با شناسه درخواستی یافت نشد', 404));

  res.status(204).json({
    status: 'success',
    data: null
  });
});
