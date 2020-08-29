/* eslint-disable no-restricted-syntax */
const mongoose = require('mongoose');
const Order = require('../models/orderModel');
const User = require('../models/userModel');
const Restaurant = require('../models/restaurantModel');
const APIFeatures = require('../utils/apiFeatures');
const AppError = require('../utils/appError');
const Delivery = require('../utils/delivery');
const catchAsync = require('../utils/catchAsync');
const fetchResources = require('../utils/fetchResources');
const { INTERVAL } = require('./restaurantController');

const _setOrderStatus = (orId, restLoc) => {
  const interval = setInterval(
    (function backgroundTask() {
      (async () => {
        // Fetch deliveries every 30 seconds
        const response = await fetchResources('deliveries');
        // If we get back response, kill the timer !
        if (response.length) {
          clearTimeout(interval);
          let selectedDelivery = new Delivery(
            response[0].velocity,
            response[0].location
          );
          // Loop through all deliveries and find the closest one to the restaurant location
          for (const delivery of response) {
            const del = new Delivery(delivery.velocity, delivery.location);
            if (
              del.deliveryTime(restLoc) < selectedDelivery.deliveryTime(restLoc)
            ) {
              selectedDelivery = del;
            }
          }
          // Next, Update order status
          await Order.findByIdAndUpdate(orId, { status: 'delivering' });
          // Finally wait till the delivery has completed
          setTimeout(() => {
            (async () => {
              await Order.findByIdAndUpdate(orId, { status: 'delivered' });
            })();
          }, Math.ceil(selectedDelivery.deliverTime) * 1000);
        }
      })();
      return backgroundTask;
    })(),
    30000
  ); // Every 30 seconds call callback
};

exports.finalizeOrder = catchAsync(async (req, res, next) => {
  // 1. Check if restaurantId and carItems exist in req.boy
  const { restaurantId, cartItems } = req.body;
  if (!restaurantId || !cartItems) {
    return next(
      new AppError('فیلد‌های شناسه رستوران و سبد خرید الزامی می باشند', 400)
    );
  }
  // 2. Check cartItems is in the right format
  if (!Array.isArray(cartItems) || !cartItems.length) {
    return next(new AppError('فیلد‌ سبد خرید نمی تواند خالی باشد', 400));
  }
  // 3. Check if there is a restaurant with specified identifier
  const restaurant = await Restaurant.findById(restaurantId);
  if (!restaurant) {
    return next(new AppError('رستورانی با شناسه درخواستی یافت نشد', 404));
  }
  // 4. Loop through the cart items and check if they exist in the the database
  let hasFoodParty = false;
  let finalTotalPrice = 0;
  let foodCreateDate;
  const foodParties = [];
  for (const item of cartItems) {
    const { itemId, quantity } = item;
    if (!itemId || !quantity || !Number.isInteger(quantity) || quantity <= 0) {
      return next(
        new AppError('فیلد‌های شناسه و تعداد محصول می‌بایست مشخص باشند', 400)
      );
    }
    const food = restaurant.menu.find(menuItem => menuItem._id.equals(itemId));
    if (!food) {
      return next(
        new AppError(
          `در منو رستوران درخواستی وجود ندارد '${itemId}' محصولی با شناسه`,
          404
        )
      );
    }
    // Check if food type is foodParty
    if (food.oldPrice) {
      // Check if food quantity is not zero
      if (food.count === 0) {
        return next(
          new AppError(
            `به اتمام رسیده‌است '${itemId}' موجودی محصول با شناسه`,
            400
          )
        );
      }
      if (food.count < quantity) {
        return next(
          new AppError(`کافی نمی‌باشد '${itemId}' موجودی محصول با شناسه`, 400)
        );
      }
      hasFoodParty = true;
      foodCreateDate = food.createdAt;
      food.count -= quantity;
      foodParties.push(food);
    }

    finalTotalPrice += food.price * quantity;
  }

  if (req.user.credit < finalTotalPrice) {
    return next(new AppError('اعتبار کاربر کافی نمی‌باشد', 400));
  }
  // 5. Handle foodParty
  if (hasFoodParty) {
    // Check if time limit is finished
    if (new Date().getTime() - new Date(foodCreateDate).getTime() >= INTERVAL)
      return next(new AppError('مدت زمان سفارش به پایان رسیده است', 400));
    // Else update restaurant menu with new data ( update food count )
    for (const foodParty of foodParties) {
      // eslint-disable-next-line no-await-in-loop
      await Restaurant.updateOne(
        { _id: restaurantId, 'menu._id': foodParty._id },
        { $set: { 'menu.$.count': foodParty.count } }
      );
    }
  }

  // 6. Update current user
  const newCredit = req.user.credit - finalTotalPrice;
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    { credit: newCredit },
    {
      new: true,
      runValidators: true
    }
  );

  // 7. Create new Order and save it in the database
  const newOrder = {
    restaurant: restaurantId,
    user: req.user.id,
    totalPrice: finalTotalPrice,
    cartItems
  };
  const order = await Order.create(newOrder);

  // 8. Find delivery for the order and set its status
  _setOrderStatus(order._id, restaurant.location);

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser
    }
  });
});

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
        date: {
          $dateToString: {
            format: '%Y-%m-%d %H:%M:%S',
            date: '$createdAt'
          }
        },
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
    },
    {
      $sort: { date: -1 }
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
