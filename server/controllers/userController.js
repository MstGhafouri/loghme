const User = require('../models/userModel');
const AppError = require('../utils/appError');
const serviceController = require('./serviceController');
const catchAsync = require('../utils/catchAsync');

const filterObject = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach(key => {
    if (allowedFields.includes(key)) newObj[key] = obj[key];
  });
  return newObj;
};

exports.filterObject = filterObject;

exports.updateMe = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        ' استفاده کنید /updatePassword برای تغییر‌ دادن رمزعبور از',
        400
      )
    );
  }

  const allowedFields = [
    'firstName',
    'lastName',
    'email',
    'credit',
    'phoneNumber'
  ];
  const filteredObj = filterObject(req.body, ...allowedFields);

  const newUser = await User.findByIdAndUpdate(req.user.id, filteredObj, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: newUser
    }
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null
  });
});

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

exports.getAllUsers = serviceController.getAll(User);
exports.getUser = serviceController.getOne(User);
exports.createUser = serviceController.createOne(User);
exports.updateUser = serviceController.updateOne(User);
exports.deleteUser = serviceController.deleteOne(User);
