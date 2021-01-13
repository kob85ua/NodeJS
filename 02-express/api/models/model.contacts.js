const fs = require('fs');
const { promises: fsPromises } = fs;
const path = require('path');

const contactsPath = path.join(__dirname, '../../db/contacts.json');

function writeJson(data) {
  fsPromises
    .writeFile(contactsPath, JSON.stringify(data))
    .then(console.log('Contacts updated!'))
    .catch(error => console.log(error));
}

async function listContacts() {
  const list = await fsPromises
    .readFile(contactsPath, 'utf-8')
    .then(results => {
      return JSON.parse(results);
    })
    .catch(error => console.log(error));
  
  return list;
}

async function getById(contactId) {
  const contact = await fsPromises
    .readFile(contactsPath, 'utf-8')
    .then(results => {
      const contactById = JSON.parse(results).find(
        contact => contact.id === contactId,
      );
      return contactById;
    })
    .catch(error => console.log(error));
  
  return contact;
}

async function removeContact(contactId) {
  const contactsList = await listContacts();
  const filteredList = contactsList.filter(contact => contact.id !== contactId);
  if (filteredList.length === contactsList.length) {
    const result = {
      message: { message: 'Not found' },
      status: 404,
    };
    return result;
  }
  await writeJson(filteredList);
  const result = {
    message: { message: 'contact deleted' },
    status: 200,
  };

  return result;
}

async function addContact(newContact) {
  const updatedList = await fsPromises
    .readFile(contactsPath, 'utf-8')
    .then(results => {
      return JSON.parse(results);
    })
    .then(data => {
      data.push(newContact);
      writeJson(data);
    })
    .then(() => {
      const data = listContacts();
      return data;
    })
    .catch(error => console.log(error));
  
  return updatedList;
}

async function updateContact(contactId, newData) {
  const contactsList = await listContacts();
  const contactToUpdate = contactsList.find(
    contact => contact.id === contactId,
  );

  if (!contactToUpdate) {
    const result = {
      message: { message: 'Not found' },
      status: 404,
    };
    return result;
  }

  const updatedContact = { ...contactToUpdate, ...newData };
  const updatedList = contactsList.map(contact => {
    if (contact.id === updatedContact.id) {
      contact = updatedContact;
      return contact;
    }
    return contact;
  });

  await writeJson(updatedList);
  const updatedContactsListFromDb = await listContacts();
  const updatedContactFromDb = updatedContactsListFromDb.find(
    contact => contact.id === contactId,
  );
  const result = {
    message: { ...updatedContactFromDb },
    status: 200,
  };
  
  return result;
}

module.exports = {
  listContacts,
  getById,
  removeContact,
  addContact,
  updateContact,
};
