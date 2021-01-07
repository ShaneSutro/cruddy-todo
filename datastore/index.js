const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');
const Promise = require('bluebird');

const readFileAsync = Promise.promisify(fs.readFile);
const writeFileAsync = Promise.promisify(fs.writeFile);

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  counter.getNextUniqueId()
    .then(newID => {
      writeFileAsync(exports.dataDir + '/' + id + '.txt', text);
      return newID;
    })
    .then((id) => callback( { id, text }))
    .catch(err => console.log(err));
};

exports.readAll = (callback) => {
  fs.readdir(exports.dataDir, (err, files) => {
    if (err) {
      callback(err, null);
    } else {
      var data = files.map(file => {
        return readFileAsync(exports.dataDir + `/${file}`, 'utf8')
          .then(text => {
            return { id: file.slice(0, 5), text: text };
          });
      });
      Promise.all(data)
        .then(todoObjects => (callback(null, todoObjects)));
    }
  });
};

exports.readOne = (id, callback) => {
  fs.readFile(exports.dataDir + `/${id}.txt`, 'utf8', (err, data) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      callback(null, { id, text: data });
    }
  });
};

exports.update = (id, text, callback) => {
  fs.readFile(exports.dataDir + `/${id}.txt`, (err, data) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      fs.writeFile(exports.dataDir + `/${id}.txt`, text, (err) => {
        if (err) {
          throw 'error saving TODO';
        } else {
          callback(null, { id, text });
        }
      });
    }
  });
};

exports.delete = (id, callback) => {
  fs.unlink(exports.dataDir + `/${id}.txt`, (err) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      callback();
    }
  });
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
