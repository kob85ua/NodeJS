const { Router } = require('express');

const UserController = require('./user.controller');

const userInfoRouter = Router();

userInfoRouter.get(
  '/current',
  UserController.authorizeUser,
  UserController.getCurrentUserInfo,
);

userInfoRouter.patch(
  '/',
  UserController.authorizeUser,
  UserController.changeUserSubscription,
);

module.exports = userInfoRouter;