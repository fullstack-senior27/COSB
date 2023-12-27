const express = require('express');
const authRoute = require('./auth.route');
const userRoute = require('./user.route');
const beauticianRoute = require('./beautician.route');
const docsRoute = require('./docs.route');
const serviceRoute = require('./service.route');
const blogRoute = require('./blog.route');
const adminRoute = require('./admin.route')
const pageRoute = require('./page.route')
const fileUploadRoute = require('./fileUpload.route')
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
    path: '/beautician',
    route: beauticianRoute,
  },
  {
    path: '/admin',
    route: adminRoute
  },
  {
    path: '/services',
    route: serviceRoute
  },
  {
    path: '/blogs',
    route: blogRoute
  },
  {
    path: '/pages',
    route: pageRoute
  },
  {
    path: '/file-upload',
    route: fileUploadRoute
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
