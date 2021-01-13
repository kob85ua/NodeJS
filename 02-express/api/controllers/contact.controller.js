const Joi = require('joi');

const contacts = require('../models/model.contacts.js');

module.exports = class ContactController {
  static async getContacts(req, res) {
    const contactsList = await contacts.listContacts();
    
    return res.json(contactsList);
  }
  static async getContactById(req, res) {
    const contactId = parseInt(req.params.contactId);

    const contactFound = await contacts.getById(contactId);

    if (!contactFound) {
      const e = {
        message: 'Not found',
      };
      return res.status(400).json(e);
    }
    return res.status(200).json(contactFound);
  }
  static async createContact(req, res) {

    const contactsList = await contacts.listContacts();

    const newContact = {
      id: contactsList[contactsList.length - 1].id + 1,
      ...req.body,
    };

    const resultList = await contacts.addContact(newContact);

    return res.status(201).json(resultList[resultList.length - 1]);
  }
  static validateCreateContact(req, res, next) {
    const createContactRules = Joi.object({
      name: Joi.string().required(),
      email: Joi.string().required(),
      phone: Joi.string().required(),
    })

    const result = createContactRules.validate(req.body);
    if (result.error) {
      return res.status(400).json({ message: result.error.details[0].message });
    }

    next();
  }
  static async deleteById(req, res) {

    const contactId = parseInt(req.params.contactId);

    const result = await contacts.removeContact(contactId);

    return res.status(result.status).json(result.message);
  }

  static async patchById(req, res) {

    const contactId = parseInt(req.params.contactId);
    
    const updatedContact = await contacts.updateContact(contactId, req.body);
    
    return res.status(updatedContact.status).json(updatedContact.message);
  }
  
  static validatePatchContact(req, res, next) {
    const patchContactRules = Joi.object({
      name: Joi.string(),
      email: Joi.string(),
      phone: Joi.string(),
    }).or('name', 'email', 'phone');

    const result = patchContactRules.validate(req.body);
    if (result.error) {
      return res.status(400).json({ message: result.error.details[0].message });
    }

    next();
  }
};
