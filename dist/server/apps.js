"use strict";

var path = require('path');
var fs = require('fs');
var utils = require('../utils/utils.js');
var express = require('express');
var dbUtils = require('./knex/utils');
console.log("====CURRENT MODE====");
console.log(" DEV: " + (process.env.NODE_ENV !== 'production'));
console.log("PROD: " + (process.env.NODE_ENV === 'production'));
console.log("====================");

// ... to front files
var path2Front = path.resolve(__dirname, '..', '..', 'dist', 'front');
console.log('Path to front: ' + path2Front);
// ... to photos
var path2Photos = path.resolve(__dirname, '..', '..', 'dist', 'photos');
console.log('Path to photos: ' + path2Photos);
if (!fs.existsSync(path2Photos)) {
  fs.mkdirSync(path2Photos);
  console.log('... just created!');
}

// ... to db files
var path2DbFiles = path.resolve(__dirname, '..', '..', 'dist', 'db');
console.log('Path to DB files: ' + path2DbFiles);
if (!fs.existsSync(path2DbFiles)) {
  fs.mkdirSync(path2DbFiles);
  console.log('... just created!');
}

// redirect all unmatched to ROOT path
var app = require('./app-ws');
app.use('/', express["static"](path2Front));
//app.use('/assets', express.static(path2Front + '/assets'))
app.use('/photos', express["static"](path2Photos));

// Save incoming image
app.post('/base64Jpeg2File', function (request, response) {
  var carNumber = request.body.carNumber;
  var infoId = request.body.infoId;
  var forDate = request.body.forDate;
  var carState = request.body.carState;
  if (!carNumber || !infoId || !forDate || !carState) {
    response.status(400).send({
      result: false,
      message: 'Parameters are not properly defined!'
    });
    return;
  }
  console.log('Get device camera image:');
  console.log(' ...          for carID:', carNumber);
  console.log(' ...           for date:', forDate);
  console.log(' ...     with car state:', carState);
  console.log(' ...         image size:', request.body.dataURL.length);
  var base64String = request.body.dataURL;
  var base64Image = base64String.split(';base64,').pop();
  var myPath = utils.getImagesDirectoryPath(path2Photos, carNumber, forDate);
  if (utils.validateDir(myPath)) {
    var myFile = utils.getUniqueId(null, carState) + '.jpeg';
    var myPath2File = path.join(myPath, myFile);
    console.log('File going to be saved as: ' + myPath2File);
    fs.writeFile(myPath2File, base64Image, {
      encoding: 'base64'
    }, function (err) {
      if (err) {
        console.error(err);
        response.send({
          result: false,
          errMessage: err.toString()
        });
      } else {
        console.log('File saved:', myPath2File);
        if (!request.body.infoId) {
          response.send({
            result: true,
            message: "Invalid infoId to add photos!"
          });
        } else {
          dbUtils.addPhoto4ioInfoId(infoId, {
            url: myFile
          }).then(function (photo) {
            response.send({
              result: true,
              photo: photo
            });
          })["catch"](function (err) {
            response.send({
              result: false,
              message: err.message
            });
          });
        }
      }
    });
  } else {
    console.log("Couldn't validate path: " + myPath);
    response.send({
      result: false,
      errMessage: "Couldn't validate path: " + myPath
    });
  }
});
app.use(function (req, res) {
  res.redirect('/');
});
if (process.env.NODE_ENV === 'development') {
  var errorhandler = require('errorhandler');
  app.use(errorhandler());
}
if (process.env.NODE_ENV !== 'production') {
  //development
  var https = require('https');
  // setup SSL for https
  var credentials = {
    key: fs.readFileSync(path.resolve(__dirname, '..', '..', 'ssl', 'key.pem')),
    cert: fs.readFileSync(path.resolve(__dirname, '..', '..', 'ssl', 'cert.pem'))
  };
  var cors = require('cors');
  app.use(cors());
  var httpsServer = https.createServer(credentials, app);
  httpsServer.listen(8443, function () {
    console.log('https(development) - listen for 8443 port');
  });
} else {
  //production
  var http = require('http');
  var httpServer = http.createServer(app);
  httpServer.listen(8080, function () {
    // we switch off it - camers don't works without https(ssl)
    console.log('http(production) - listen for 8080 port');
  });
}