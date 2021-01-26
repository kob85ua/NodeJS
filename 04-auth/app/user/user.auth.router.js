const { Router } = require('express');

const UserController = require('./user.controller');

const userAuthRouter = Router();

userAuthRouter.post(
  '/register',
  UserController.validateEmailPassword,
  UserController.registerUser,
);

userAuthRouter.post(
  '/login',
  UserController.validateEmailPassword,
  UserController.loginUser,
);

userAuthRouter.post(
  '/logout',
  UserController.authorizeUser,
  UserController.logoutUser,
);

module.exports = userAuthRouter;
