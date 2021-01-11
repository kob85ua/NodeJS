// const users = [
//     {
//         id: 1,
//         name: "MIKE",
//         email: "dsd@gmail",
//         phone: "456-45-90"
//     }

// ]
const fs = require('fs');
// const { promises: fsPromises } = fs;
const path = require('path');

// const contactsPath = path.join(__dirname, '../db/contacts.json');
const contacts = require('../contacts.js');
// const db = require("../../db/contacts.json")

module.exports = class ContactController {
  static async getContacts(req, res, next) {
    const users = await contacts.listContacts();
    console.log(users);
    return res.json(users);
  }
};
