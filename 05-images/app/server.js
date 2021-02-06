const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const contactRouter = require('./contact/contact.router');
const userAuthRouter = require('./user/user.auth.router');
const userInfoRouter = require('./user/user.info.router');

require('dotenv').config();

const PORT = process.env.PORT || 3000;

const accessLogStream = fs.createWriteStream(
  path.join(__dirname, 'access.log'),
  {
    flags: 'a',
  },
);

module.exports = class ContactsServer {
  constructor() {
    this.server = null;
  }

  async start() {
    this.initServer();
    this.initMiddlewares();
    this.initRoutes();
    await this.connectToDb();
    this.startListening();
  }

  initServer() {
    this.server = express();
  }

  initMiddlewares() {
    this.server.use(express.json());
    this.server.use(cors({ origin: 'http://localhost:3000' }));
    this.server.use(morgan('combined', { stream: accessLogStream }));
  }

  initRoutes() {
    this.server.use('/api/contacts', contactRouter);
    this.server.use('/auth', userAuthRouter);
    this.server.use('/users', userInfoRouter);
  }

  async connectToDb() {
    try {
      await mongoose.connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
      });
      console.log('Database connection successful');
    } catch (err) {
      console.error(err);
      process.exit(1);
    }
  }

  startListening() {
    this.server.listen(PORT, () => {
      console.log('Started listening on port', PORT);
    });
  }
};
