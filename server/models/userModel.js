const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'فیلد نام کاربر الزامی است'],
    trim: true
  },
  lastName: {
    type: String,
    required: [true, 'فیلد نام‌خانوادگی کاربر الزامی است'],
    trim: true
  },
  credit: {
    type: Number,
    default: 0,
    min: [0, 'مقدار فیلد اعتبار نمی‌تواند کمتر از صفر باشد']
  },
  email: {
    type: String,
    required: [true, 'فیلد ایمیل کاربر الزامی است'],
    unique: [true, 'آدرس ایمیل از قبل استفاده شده‌است'],
    lowercase: true,
    validate: [validator.isEmail, 'آدرس ایمیل معتبر نمی باشد']
  },
  photo: {
    type: String,
    default: 'default.jpg'
  },
  phoneNumber: {
    type: String,
    required: [true, 'فیلد شماره تماس الزامی است'],
    validate: {
      validator: function (value) {
        return value && /^([0][9][0-9]{9})$/i.test(value);
      },
      message: 'شماره تماس معتبر نیست'
    }
  },
  role: {
    type: String,
    default: 'user',
    lowercase: true,
    trim: true,
    enum: {
      values: ['user', 'admin'],
      message: 'Role must be either "user" or "admin"'
    }
  },
  password: {
    type: String,
    required: [true, 'فیلد رمزعبور کاربر الزامی است'],
    minlength: [7, 'طول رمزعبور می‌بایست حداقل هفت کاراکتر باشد'],
    select: false
  },
  passwordConfirm: {
    type: String,
    required: [true, 'فیلد تکرار رمزعبور الزامی است'],
    validate: {
      // THIS ONLY WORKS ON CREATE AND SAVE !
      validator: function (value) {
        return value === this.password;
      },
      message: 'رمزعبور همخوانی ندارد'
    }
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false
  }
});

// ENCODE PASSWORDS BY BCRYPTJS
userSchema.pre('save', async function (next) {
  // ONLY HASH PASSWORD IF IS MODIFIED
  if (!this.isModified('password')) return next();
  // HASH PASSWORD BY COST OF 12
  this.password = await bcrypt.hash(this.password, 12);
  // NO NEED TO STORE PASSWORD_CONFIRM IN OUR DATABASE
  this.passwordConfirm = undefined;
  next();
});

userSchema.pre('save', function (next) {
  // ONLY SET PASSWORD CHANGED AT IF IS MODIFIED AND IS NOT NEW
  if (!this.isModified('password') || this.isNew) return next();
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});

// METHOD TO CHECK PASSWORDS ARE THE SAME (FOR LOGIN ACTION)
userSchema.methods.checkPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

// METHOD TO CHECK IF USER CHANGED PASSWORD AFTER TOKEN WAS ISSUED
userSchema.methods.changePasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return changedTimestamp > JWTTimestamp;
  }
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes from now
  return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
