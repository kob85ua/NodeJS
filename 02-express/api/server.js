const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const contactRouter = require('./routers/contact.router');

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

  start() {
    this.initServer();
    this.initMiddlewares();
    this.initRoutes();
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
  }

  startListening() {
    this.server.listen(PORT, () => {
      console.log('Started listening on port', PORT);
    });
  }
};
