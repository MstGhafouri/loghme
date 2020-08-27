const express = require('express');
const restaurantController = require('../controllers/restaurantController');
const authController = require('../controllers/authController');

const router = express.Router();

router.get('/slug/:slug', restaurantController.getRestaurantBySlug);
router.get('/food-parties', restaurantController.getFoodParties);
router.get('/remaining-time', restaurantController.getRemainingTime);

router
  .route('/')
  .get(restaurantController.getAllRestaurants)
  .post(
    authController.protect,
    authController.restrictTo('admin'),
    restaurantController.createRestaurant
  );

router
  .route('/:id')
  .get(restaurantController.getRestaurant)
  .patch(
    authController.protect,
    authController.restrictTo('admin'),
    restaurantController.updateRestaurant
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin'),
    restaurantController.deleteRestaurant
  );

module.exports = router;
