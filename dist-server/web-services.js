"use strict";

var utils = require('./utils');

var express = require('express');

var app = express();
app.use(express.json());

var cors = require('cors');

app.use(cors());

var path = require('path');

var dataPath = path.resolve(__dirname, '..', 'data');
console.warn('Data path defined as: ' + dataPath);
app.use(express["static"](dataPath));
var _PORT = 8181;
app.get('/', function (req, res) {
  // downloadImageFromURL('http://kpp:Kpp_1234@192.168.4.150/ISAPI/Streaming/channels/101/picture?snapShotImageType=JPEG', 'kpp.jpeg');
  res.send('Hello from App Engine v4! _PORT: ' + _PORT);
});
app.post('/base64Jpeg2File', function (request, response) {
  console.log(request.body.dataURL.length);
  var base64String = request.body.dataURL;
  var base64Image = base64String.split(';base64,').pop();
  var myPath = utils.getImagesDirectory(dataPath, request.body.carNumber);

  if (utils.validateDir(myPath)) {
    var myFile = utils.getUniqueId(null, request.body.carState) + '.jpeg';
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

        var _imageUrl = utils.getImageAccessUrl(request.body.carNumber, myFile);

        console.log('Image access URL:', _imageUrl);
        response.send({
          result: true,
          image: _imageUrl
        });
      }
    });
  } else {
    console.log("Couldn't validate path: " + myPath);
    response.send({
      result: false,
      errMessage: "Couldn't validate path: " + myPath
    });
  }
}); // Listen to the App Engine-specified port, or 8181 otherwise

var PORT = process.env.PORT || _PORT;
app.listen(PORT, function () {
  console.log("Server listening on port ".concat(PORT, "..."));
}); // ############### Web service part

var fs = require('fs'),
    http = require('http'),
    https = require('https');

var Stream = require('stream').Transform;

var downloadImageFromURL = function downloadImageFromURL(url, filename, callback) {
  var username = 'kpp';
  var password = 'Kpp_1234';
  var auth = 'Basic ' + Buffer.from(username + ':' + password).toString('base64');
  var client = http;

  if (url.toString().indexOf("https") === 0) {
    client = https;
  }

  var options = new URL(url);
  var req = client.request(options, function (response) {
    var data = new Stream();
    response.on('data', function (chunk) {
      data.push(chunk);
    });
    response.on('end', function () {
      fs.writeFileSync(filename, data.read());
    });
  });
  req.on('error', function (err) {
    console.log(err.toString());
  });
  req.end();
};