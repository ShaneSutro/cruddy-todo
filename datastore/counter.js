const fs = require('fs');
const path = require('path');
const sprintf = require('sprintf-js').sprintf;
const Promise = require('bluebird');
const readFileAsync = Promise.promisify(fs.readFile);
const writeFileAsync = Promise.promisify(fs.writeFile);

var counter = 0;

// Private helper functions ////////////////////////////////////////////////////

// Zero padded numbers can only be represented as strings.
// If you don't know what a zero-padded number is, read the
// Wikipedia entry on Leading Zeros and check out some of code links:
// https://www.google.com/search?q=what+is+a+zero+padded+number%3F

const zeroPaddedNumber = (num) => {
  return sprintf('%05d', num);
};

const readCounter = () => {
  return new Promise((resolve, reject) => {
    readFileAsync(exports.counterFile)
      .then(fileData => resolve(Number(fileData)))
      .catch(err => resolve(0));
  });
};

const writeCounter = (count) => {
  return new Promise ((resolve, reject) => {
    var counterString = zeroPaddedNumber(count);
    writeFileAsync(exports.counterFile, counterString)
      .then(() => resolve(counterString))
      .catch(err => {
        reject('error writing counter');
      });
  });
};

// Public API - Fix this function //////////////////////////////////////////////

exports.getNextUniqueId = () => {
  return new Promise((resolve, reject) => {
    readCounter()
      .then(count => zeroPaddedNumber(count + 1))
      .then(incrementedID => writeCounter(incrementedID))
      .then(id => resolve(id))
      .catch(err => reject(err));
  });
};

// Configuration -- DO NOT MODIFY //////////////////////////////////////////////

exports.counterFile = path.join(__dirname, 'counter.txt');
