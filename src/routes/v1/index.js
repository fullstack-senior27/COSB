const express = require('express');
const authRoute = require('./auth.route');
const userRoute = require('./user.route');
// const beauticianRoute = require('./beautician.route');
const docsRoute = require('./docs.route');
const salonRoute = require('./salon.route');
const serviceCategoryRoute = require('./serviceCategory.route');
const serviceRoute = require('./service.route');
const blogRoute = require('./blog.route');
const blogCategoryRoute = require('./blogCategory.route');
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
  // {
  //   path: '/beautician',
  //   route: beauticianRoute,
  // },
  {
    path: '/salons',
    route: salonRoute
  },
  {
    path: '/services',
    route: serviceRoute
  },
  {
    path: '/service/categories',
    route: serviceCategoryRoute
  },
  {
    path: '/blogs',
    route: blogRoute
  },
  {
    path: '/blogs/category',
    route: blogCategoryRoute
  }
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
