const Joi = require('joi');

const Contact = require('./Contact');

const {
  Types: { ObjectId },
} = require('mongoose');

module.exports = class ContactController {
  static async getContacts(req, res) {
    const contactsList = await Contact.find();
    return res.json(contactsList);
  }

  static async getContactById(req, res) {
    const contactId = req.params.contactId;
    const contactFound = await Contact.findById(contactId);
    if (!contactFound) {
      return res.status(404).json('Contact is not found');
    }
    return res.status(200).json(contactFound);
  }

  static async createContact(req, res) {
    try {
      const contact = await Contact.create(req.body);
      return res.status(201).json(contact);
    } catch (error) {
      return res.status(500).send(error);
    }
  }

  static validateCreateContact(req, res, next) {
    const createContactRules = Joi.object({
      name: Joi.string().required(),
      email: Joi.string().required(),
      phone: Joi.string().required(),
      password: Joi.string().required(),
      subscription: Joi.string().required().valid('free', 'pro', 'premium'),
    });

    const result = createContactRules.validate(req.body);
    if (result.error) {
      return res.status(400).json({ message: result.error.details[0].message });
    }

    next();
  }

  static async deleteById(req, res) {
    const contactId = req.params.contactId;
    const contact = await Contact.findByIdAndDelete(contactId);
    if (!contact) {
      return res.status(404).send('Contact is not found');
    }
    return res.status(200).json(contact);
  }

  static async patchById(req, res) {
    const contactId = req.params.contactId;
    const contact = await Contact.findByIdAndUpdate(
      contactId,
      { $set: req.body },
      {
        new: true,
      },
    );
    if (!contact) {
      return res.status(404).send('Contact is not found');
    }
    return res.status(200).json(contact);
  }

  static validatePatchContact(req, res, next) {
    const patchContactRules = Joi.object({
      name: Joi.string(),
      email: Joi.string(),
      phone: Joi.string(),
      password: Joi.string(),
      subscription: Joi.string().valid('free', 'pro', 'premium'),
    }).or('name', 'email', 'phone', 'password', 'subscription');

    const result = patchContactRules.validate(req.body);
    if (result.error) {
      return res.status(400).json({ message: result.error.details[0].message });
    }

    next();
  }

  static validateId(req, res, next) {
    const contactId = req.params.contactId;
    if (!ObjectId.isValid(contactId)) {
      return res.status(400).send('Contact id is not valid');
    }

    next();
  }
};
