"use strict";

var _common = require("./common.js");

var path = require('path'); 

exports.formateDate = _common.commonFormateDate;

function string2Date(dateString) {
  if (dateString) {
    var parts = dateString.split('-');
    return new Date(parts[0], parts[1] - 1, parts[2]);
  }

  return new Date();
}

exports.string2Date = string2Date;

function getImagesDirectory(dataPath, carNumber, date) {
  return path.join(dataPath, '..', 'data', 'cars', carNumber, (0, _common.commonFormateDate)(string2Date(date)));
}

exports.getImagesDirectory = getImagesDirectory;

function getImageAccessUrl(carNumber, fileName, forDate) {
  return ['cars', carNumber, (0, _common.commonFormateDate)(string2Date(forDate)), fileName].join('/');
}

exports.getImageAccessUrl = getImageAccessUrl;

function getUniqueId(prefix, postfix) {
  var _result = new Date().valueOf();

  _result = prefix ? prefix + '-' + _result : '' + _result;
  _result = postfix ? _result + '-' + postfix : _result;
  return _result;
}

exports.getUniqueId = getUniqueId;

var fs = require('fs');

function validateDir(myPath) {
  if (fs.existsSync(myPath)) {
    console.log("Directory already exists: " + myPath);
    return true;
  } else {
    var myResult = fs.mkdirSync(myPath, {
      recursive: true
    }, function (err) {
      if (err) {
        console.error(err);
        return false;
      }

      console.log('Directory created successfully: ' + myPath);
      return true;
    });
    console.log(myResult);
    return true;
  }
}

exports.validateDir = validateDir;