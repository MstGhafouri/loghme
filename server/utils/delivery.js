module.exports = class Delivery {
  constructor(velocity, location) {
    this.velocity = velocity;
    this.location = location;
    this.deliverTime = 0;
  }

  deliveryTime(restaurantLocation) {
    let time = 0;
    let distance = 0;

    const x = this.location.x - restaurantLocation.x;
    const y = this.location.y - restaurantLocation.y;

    distance = Math.hypot(x, y); // Distance form deliveries to restaurant
    // Add distance from the user
    // We are assuming that the user is located in the center
    distance += Math.hypot(restaurantLocation.x, restaurantLocation.y);

    time = distance / this.velocity;

    this.deliverTime = time;
    return time;
  }
};
