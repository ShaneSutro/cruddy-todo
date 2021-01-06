const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  counter.getNextUniqueId((err, id) => {
    fs.writeFile(exports.dataDir + '/' + id + '.txt', text, (err) => {
      if (err) {
        throw 'error saving TODO';
      } else {
        callback(null, { id, text });
      }
    });
  });
};

exports.readAll = (callback) => {
  fs.readdir(exports.dataDir, (err, files) => {
    if (err) {
      throw 'error reading data directory';
    } else {
      var data = files.map(file => ({id: file.slice(0, 5), text: file.slice(0, 5)}));
      callback(null, data);
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
