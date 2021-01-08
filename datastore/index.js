const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');
const Promise = require('bluebird');

const readFileAsync = Promise.promisify(fs.readFile);
const writeFileAsync = Promise.promisify(fs.writeFile);
const readDirAsync = Promise.promisify(fs.readdir);
const unlinkAsync = Promise.promisify(fs.unlink);

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  var fileData = text + `\nCreated ${new Date()}\nUpdated ${new Date()}`;
  const todo = { text };
  counter.getNextUniqueId()
    .then(newID => {
      var file = exports.dataDir + '/' + newID + '.txt';
      todo.id = newID;
      return writeFileAsync(file, fileData);
    })
    .then(() => callback(null, todo))
    .catch(err => console.log('Logged Error', err));
};

exports.readAll = (callback) => {
  readDirAsync(exports.dataDir)
    .then(files => files.map(file => {
      return readFileAsync(exports.dataDir + `/${file}`, 'utf8')
        .then(text => text.split('\n')[0])
        .then(splitText => {
          return { id: file.slice(0, 5), text: splitText };
        });
    }))
    .then(promises => Promise.all(promises))
    .then(todoObjects => (callback(null, todoObjects)))
    .catch(err => callback(err, null));
};

exports.readOne = (id, callback) => {
  readFileAsync(exports.dataDir + `/${id}.txt`, 'utf8')
    .then(data => data.split('\n')[0])
    .then(text => callback(null, { id, text }))
    .catch(err => callback(err, null));
};

exports.update = (id, text, callback) => {
  readFileAsync(exports.dataDir + `/${id}.txt`, 'utf8')
    .then(data => {
      var created = data.split('\n')[1];
      var fileData = text + '\n' + created + `\nUpdated ${new Date()}`;
      return writeFileAsync(exports.dataDir + `/${id}.txt`, fileData);
    })
    .then(() => callback(null, { id, text }))
    .catch(err => {
      console.error(err);
      callback('Update failed: ' + err, null);
    });
};

exports.delete = (id, callback) => {
  unlinkAsync(exports.dataDir + `/${id}.txt`)
    .then(() => callback())
    .catch(err => callback(new Error(`No item with id: ${id}`)));
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
