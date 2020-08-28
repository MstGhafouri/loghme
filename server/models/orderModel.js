const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  restaurant: {
    type: mongoose.Schema.ObjectId,
    ref: 'Restaurant',
    required: [true, 'شناسه رستوران الزامی است']
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'شناسه کاربر الزامی است']
  },
  totalPrice: {
    type: Number,
    required: [true, 'هزینه کل سفارش الزامی است'],
    min: [0, 'هزینه کل نمی‌تواند نمی‌تواند کمتر از صفر باشد']
  },
  createdAt: {
    type: Date,
    default: Date.now()
  },
  status: {
    type: String,
    default: 'findingDelivery',
    trim: true,
    enum: {
      values: ['findingDelivery', 'delivering', 'delivered'],
      message:
        'status must be either "findingDelivery", "delivering" or "delivered"'
    }
  },
  cartItems: {
    validate: {
      validator: v => Array.isArray(v) && v.length > 0,
      message: 'سبد خرید نمی‌تواند خالی باشد'
    },
    type: [
      {
        itemId: {
          type: mongoose.Schema.ObjectId,
          required: [true, 'شناسه محصول الزامی است']
        },
        quantity: {
          type: Number,
          required: [true, 'تعداد محصول می‌بایست مشخص باشد'],
          min: [1, 'تعداد نمی‌تواند کمتر از یک باشد']
        }
      }
    ]
  }
});

orderSchema.pre(/^find/, function (next) {
  // this.populate('user').populate({
  //   path: 'restaurant',
  //   select: 'name menu'
  // });
  next();
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
