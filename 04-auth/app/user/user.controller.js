const Joi = require('joi');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('./User');


module.exports = class UserController {
  static async registerUser(req, res) {
    try {
      const {
        body: { password },
      } = req;

      const hash = await bcryptjs.hash(password, 10);

      const userToCreate = await User.create({
        ...req.body,
        password: hash,
      });
      
      const { _id } = userToCreate;
      const tokenToDb =  jwt.sign({ _id }, process.env.JWT_SECRET);

      const userWithTokenInDb = await User.findByIdAndUpdate(
        _id,
        { $set: { token: tokenToDb } },
        {
          new: true,
        },
      );
      const { email, subscription, token } = userWithTokenInDb;

      return res.status(201).json({
        user: { email, subscription, token },
      });
    } catch (error) {
      if (!error.keyPattern) {
        return res.status(400).json(error);
      }

      return res.status(409).json({
        message: 'Email in use',
      });
    }
  }

  static async loginUser(req, res) {
    const {
      body: { email, password },
    } = req;

    const userToLogin = await User.findOne({
      email,
    });

    if (!userToLogin) {
      return res.status(401).send('Email or password is wrong');
    }
    const result = await bcryptjs.compare(password, userToLogin.password);

    if (!result) {
      return res.status(401).send('Email or password is wrong');
    }
    const { _id } = userToLogin;

    const tokenToDb =  jwt.sign({ _id }, process.env.JWT_SECRET);

    const userWithTokenInDb = await User.findByIdAndUpdate(
      _id,
      { $set: { token: tokenToDb } },
      {
        new: true,
        runValidators: true,
      },
    );
    const { subscription, token } = userWithTokenInDb;

    return res.json({
      tokenToDb,
      user: {
        email,
        subscription,
        token,
      },
    });
  }

  static async authorizeUser(req, res, next) {
    const authorizationHeader = req.get('Authorization');

    if (!authorizationHeader) {
      return res.status(401).json({
        message: 'Not authorized',
      });
    }

    const token = authorizationHeader.replace('Bearer ', '');

    try {
      const { userId } = await jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(userId);
      req.user = user;
      next();
    } catch (error) {
      return res.status(401).json({
        message: 'Not authorized',
      });
    }
  }

  static async logoutUser(req, res) {
    const userId = req.user._id;

    try {
      // const token = await jwt.sign({ userId }, process.env.JWT_SECRET, {
      //   expiresIn: 1,
      // });
      await User.findByIdAndUpdate(
        userId,
        { $set: { token: '' } },
        {
          new: true,
        },
      );
      req.headers.authorization = 'Bearer ';
      //   console.log(res.headers.authorization);
      return res.status(204).send();
    } catch (error) {
      return res.status(500).send(error);
    }
  }

  static getCurrentUserInfo(req, res) {
    const { email, subscription } = req.user;
    return res.status(200).json({ email, subscription });
  }

  static async changeUserSubscription(req, res) {
    // console.log(User.schema.path('subscription').enumValues);
    const userId = req.user._id;
    try {
      const user = await User.findByIdAndUpdate(
        userId,
        { $set: req.body },
        {
          new: true,
          runValidators: true,
        },
      );

      const { email, subscription } = user;

      return res.status(200).json({ email, subscription });
    } catch (error) {
      return res.status(400).json(error.message);
    }
  }

  static validateEmailPassword(req, res, next) {
    const rules = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
      token: Joi.string(),
    });
    const result = rules.validate(req.body);
    if (result.error) {
      return res.status(400).json({ message: result.error.details[0].message });
    }
    next();
  }
};
