const express = require('express');
const authRoute = require('./auth.route');
const userRoute = require('./user.route');
const tourRoute = require('./tour.route');
const hotelRoute = require('./hotel.route');
const bookingRoute = require('./booking.route');
const reviewRoute = require('./review.route');
const serviceRoute = require('./service.route');
const notificationRoute = require('./notification.route');
const docsRoute = require('./docs.route');
const config = require('../../config/config');

const router = express.Router();

const defaultRoutes = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/users',
    route: userRoute,
  },
  {
    path: '/tours',
    route: tourRoute,
  },
  {
    path: '/hotels',
    route: hotelRoute,
  },
  {
    path: '/bookings',
    route: bookingRoute,
  },
  {
    path: '/reviews',
    route: reviewRoute,
  },
  {
    path: '/services',
    route: serviceRoute,
  },
  {
    path: '/notifications',
    route: notificationRoute,
  },
];

const devRoutes = [
  // routes available only in development mode
  {
    path: '/docs',
    route: docsRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

/* istanbul ignore next */
if (config.env === 'development') {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}

module.exports = router;
