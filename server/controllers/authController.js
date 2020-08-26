const { promisify } = require('util');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const AppError = require('../utils/appError');
const Email = require('../utils/email');
const catchAsync = require('../utils/catchAsync');
const { filterObject } = require('./userController');

const signToken = id =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });

const createAndSendToken = (user, statusCode, req, res) => {
  const token = signToken(user._id);
  res.cookie('jwt', token, {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    // In production we set secure cookies to true, then only in https cookie will send!
    secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
    httpOnly: true // Browser would not be able to access or modify cookie ( only save and send back!)
  });

  user.password = undefined;
  user.__v = undefined;
  user.active = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user
    }
  });
};

//  ***** SIGN UP ******
exports.signup = catchAsync(async (req, res, next) => {
  const allowedFields = [
    'firstName',
    'lastName',
    'email',
    'credit',
    'phoneNumber',
    'password',
    'passwordConfirm'
  ];
  const filteredBody = filterObject(req.body, ...allowedFields);

  const newUser = await User.create(filteredBody);

  const url = `${req.protocol}://${req.get('host')}/profile`;
  await new Email(newUser, url).sendWelcome();
  createAndSendToken(newUser, 201, req, res);
});

//  ***** LOG IN ******
exports.login = catchAsync(async (req, res, next) => {
  // 1) FIRST CHECK IF EMAIL AND PASSWORD EXIST
  const { email, password } = req.body;
  if (!email || !password)
    return next(new AppError('لطفا رمزعبور و ایمیل خود را وارد کنید', 400));
  // 2) CHECK IF USER EXIST & PASSWORD IS CORRECT
  const currentUser = await User.findOne({ email }).select('+password');
  if (
    !currentUser ||
    !(await currentUser.checkPassword(password, currentUser.password))
  ) {
    return next(new AppError('رمزعبور و یا آدرس ایمیل معتبر نیست', 401));
  }
  // 3) IF EVERYTHING IS OK, SEND TOKEN TO CLIENT
  createAndSendToken(currentUser, 200, req, res);
});

//  ***** LOG IN WITH GOOGLE ******
exports.googleLogin = catchAsync(async (req, res, next) => {
  // 1) FIRST CHECK IF EMAIL AND PASSWORD EXIST
  const { email } = req.body;
  if (!email)
    return next(new AppError('لطفا آدرس ایمیل خود را وارد کنید', 400));
  // 2) CHECK IF USER EXIST
  const user = await User.findOne({ email });

  // USER DOES NOT EXIST, SO REDIRECT USER TO SIGN UP PAGE
  if (!user) {
    return res.status(200).json({
      status: 'success',
      data: null
    });
  }
  // 3) IF USER EXISTS, SEND TOKEN TO CLIENT
  createAndSendToken(user, 200, req, res);
});

exports.logout = (req, res) => {
  res.cookie('jwt', 'logoutCookie', {
    expires: new Date(Date.now() + 5000),
    httpOnly: true
  });

  res.status(200).json({ status: 'success' });
};

//  ***** PROTECT ROUTES ******
exports.protect = catchAsync(async (req, res, next) => {
  // 1) GET TOKEN AND CHECK IF IT'S THERE
  const { authorization } = req.headers;
  let token = null;
  if (authorization && authorization.startsWith('Bearer')) {
    token = authorization.split(' ')[1];
  }
  // Check if token is in the cookies
  if (!token && req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(new AppError('برای دسترسی ابتدا وارد سایت شوید', 401));
  }
  // 2) NEXT VALIDATE TOKEN
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  // 3) CHECK IF USER STILL EXISTS
  const currentUser = await User.findById(decoded.id);
  if (!currentUser)
    return next(new AppError('کاربر متعلق به این توکن دیگر وجود ندارد', 401));
  // 4) CHECK IF USER CHANGED PASSWORD AFTER THE TOKEN WAS ISSUED
  if (currentUser.changePasswordAfter(decoded.iat)) {
    return next(
      new AppError(
        'رمزعبور به تازگی تغییر پیدا کرده‌است، لطفا دوباره وارد سایت شوید',
        401
      )
    );
  }
  // USER NOW HAS GRAND ACCESS TO PROTECTED ROUTE
  req.user = currentUser;
  next();
});

//  ***** RESTRICT ROUTES ******
exports.restrictTo = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return next(new AppError('امکان دسترسی برای شما وجود ندارد', 403));
  }
  next();
};

//#region  ***** FORGOT PASSWORD ******
exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1) GET USER BASED ON POSTED EMAIL
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError('کاربری با آدرس ایمیل وارد شده یافت نشد', 404));
  }
  // 2) GENERATE RANDOM RESET TOKEN
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  try {
    // 3) SEND IT TO USER'S EMAIL
    const resetURL = `${req.protocol}://${req.get(
      'host'
    )}/password-reset/${resetToken}`;
    await new Email(user, resetURL).sendPasswordReset();

    res.status(200).json({
      status: 'success',
      message: 'توکن به آدرس ایمیل ارسال شد'
    });
  } catch (error) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return next(
      new AppError('خطا در ارسال ایمیل، لطفا دوباره امتحان کنید', 500)
    );
  }
});
//#endregion

//  ***** RESET PASSWORD ******
exports.resetPassword = catchAsync(async (req, res, next) => {
  // 1) GET USER BASED ON THE TOKEN
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() }
  });
  // 2) IF TOKEN HAS NOT EXPIRED & THERE IS A USER THEN RESET PASSWORD
  if (!user) {
    return next(new AppError('توکن معتبر نیست و یا منقضی شده‌است', 400));
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  // 3) UPDATE PASSWORD_CHANGED_AT PROPERTY FOR THE USERS (DOCUMENT MIDDLEWARE DOES IT FOR US!)
  // 4) LOG IN THE USER, SEND JWT
  createAndSendToken(user, 200, req, res);
});

//  ***** UPDATE PASSWORD ******
exports.updatePassword = catchAsync(async (req, res, next) => {
  // 1) GET USER FROM COLLECTION
  const user = await User.findById(req.user.id).select('+password');
  // 2) CHECK IF POSTED CURRENT PASSWORD IS CORRECT
  const { currentPassword, password, passwordConfirm } = req.body;
  if (!currentPassword) {
    return next(new AppError('رمزعبور فعلی الزامی است', 400));
  }
  if (!(await user.checkPassword(currentPassword, user.password))) {
    return next(new AppError('رمزعبور فعلی معتبر نیست', 401));
  }
  // 3) IF SO, UPDATE PASSWORD
  user.password = password;
  user.passwordConfirm = passwordConfirm;
  await user.save();
  // 4) LOG USER IN, SEND JWT
  createAndSendToken(user, 200, req, res);
});
