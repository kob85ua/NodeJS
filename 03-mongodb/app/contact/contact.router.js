const { Router } = require('express');

const ContactController = require('./contact.controller');

// const Contact = require('./Contact');

const contactRouter = Router();

contactRouter.get('/', ContactController.getContacts);

contactRouter.get(
  '/:contactId',
  ContactController.validateId,
  ContactController.getContactById,
);

contactRouter.post(
  '/',
  ContactController.validateCreateContact,
  ContactController.createContact,
);

contactRouter.delete(
  '/:contactId',
  ContactController.validateId,
  ContactController.deleteById,
);

contactRouter.patch(
  '/:contactId',
  ContactController.validateId,
  ContactController.validatePatchContact,
  ContactController.patchById,
);

module.exports = contactRouter;
