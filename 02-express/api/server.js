const express = require('express');
const cors = require('cors');
const contactRouter = require('./routers/contact.router')
require('dotenv').config()
// console.log('CONTACT_ROUTER', contactRouter);
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
  }
    initRoutes() {
      this.server.use('/api/contacts', contactRouter);
  }
    startListening() {
        this.server.listen(process.env.PORT, () => {
          console.log('Started listening on port', process.env.PORT)
      })
  }
}
