const { Router } = require('express');
const ContactController = require('../controllers/contact.controller');
const contactRouter = Router();

contactRouter.get('/', ContactController.getContacts);
contactRouter.get('/:contactId', ContactController.getContactById);
contactRouter.post(
  '/',
  ContactController.validateCreateContact,
  ContactController.createContact,
);
contactRouter.delete('/:contactId', ContactController.deleteById);
contactRouter.patch('/:contactId', ContactController.validatePatchContact, ContactController.patchById);
module.exports = contactRouter;
