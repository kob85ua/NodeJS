
const fs = require('fs');
const { promises: fsPromises } = fs;
const path = require('path');

const contactsPath = path.join('db', 'contacts.json');

function writeJson(pathToFile, data) {
  fsPromises
    .writeFile(pathToFile, JSON.stringify(data))
    .then(console.log('Contacts updated!'))
    .then(listContacts())
    .catch(error => console.log(error));
}

function listContacts() {
  fsPromises
    .readFile(contactsPath, 'utf-8')
    .then(results => console.table(JSON.parse(results)))
    .catch(error => console.log(error));
}

function getContactById(contactId) {
  fsPromises
    .readFile(contactsPath, 'utf-8')
    .then(results => {
      const contactById = JSON.parse(results).find(
        contact => contact.id === contactId,
      );
      console.table(contactById);
    })
    .catch(error => console.log(error));
}

function removeContact(contactId) {
  fsPromises
    .readFile(contactsPath, 'utf-8')
    .then(results => {
      return JSON.parse(results).filter(contact => contact.id !== contactId);
    })
    .then(filteredContacts => {
      writeJson(contactsPath, filteredContacts)
      
    })
    .catch(error => console.log(error));
}

function addContact(name, email, phone) {
  fsPromises
    .readFile(contactsPath, 'utf-8')
    .then(results => { return JSON.parse(results) })
    .then(
      data => {
        const newContact = {
          id: data[data.length - 1].id + 1,
          name: name,
          email: email,
          phone: phone,
        };
        data.push(newContact);
        writeJson(contactsPath, data)
        
      }
    )
    .catch(error => console.log(error));
}
module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
};
