const utils = require('../utils/utils.js');
const express = require('express');
const app = require("./app-ws");
const PORT = process.env.PORT || 8181;

const NODE_ENV_DEV = 'development';
const NODE_ENV = (process.env.NODE_ENV || NODE_ENV_DEV).trim(); // !!!BUGFIX!!!

console.log('API Server environment:', NODE_ENV);

// ... just for DEVELOPMENT-CORS using from localhost
console.log("NODE_ENV === NODE_ENV_DEV", NODE_ENV === NODE_ENV_DEV)
if (NODE_ENV === NODE_ENV_DEV) {
    const cors = require('cors')
    app.use(cors());
    console.warn("!!!WARNING!!! We're using CORS just for DEVELOPMENT!");
}



// Define static file path
const path = require('path');
// ... to front files
const path2Front = path.resolve(__dirname, '..', '..', 'dist', 'front');
console.log('Path to photos: ' + path2Front);
app.use('/',express.static(path2Front));
// ... to photos
const path2Photos = path.resolve(__dirname, '..', '..', 'dist', 'photos');
console.log('Path to photos: ' + path2Photos);
app.use('/photos',express.static(path2Photos));

// Save incoming image
app.post('/base64Jpeg2File', (request, response) => {
  console.log(request.body.dataURL.length);
  let base64String = request.body.dataURL;
  let base64Image = base64String.split(';base64,').pop();
  let myPath = utils.getImagesDirectoryPath(path2Photos, request.body.carNumber);
  if (utils.validateDir(myPath)) {
      let myFile = utils.getUniqueId(null, request.body.carState) + '.jpeg';
      let myPath2File = path.join(myPath, myFile);
      console.log('File going to be saved as: ' + myPath2File);
      fs.writeFile(myPath2File, base64Image, { encoding: 'base64' }, function (err) {
          if (err) {
              console.error(err)
              response.send({ result: false, errMessage: err.toString() });
          } else {
              console.log('File saved:', myPath2File);
              let _imageUrl = utils.getImageAccessUrl(request.body.carNumber, myFile);
              console.log('Image access URL:', _imageUrl);
              response.send({ result: true, image: _imageUrl });
          }
      })
  } else {
      console.log("Couldn't validate path: " + myPath);
      response.send({ result: false, errMessage: ("Couldn't validate path: " + myPath) });
  }
});

// ############### Web service part

var fs = require('fs'),
    http = require('http'),
    https = require('https');

var Stream = require('stream').Transform;
var downloadImageFromURL = (url, filename, callback) => {
    var username = 'kpp';
    var password = 'Kpp_1234';
    var auth = 'Basic ' + Buffer.from(username + ':' + password).toString('base64');

    var client = http;
    if (url.toString().indexOf("https") === 0) {
        client = https;
    }

    const options = new URL(url);

    var req = client.request(options, function (response) {
        var data = new Stream();

        response.on('data', function (chunk) {
            data.push(chunk);
        });

        response.on('end', function () {
            fs.writeFileSync(filename, data.read());
        });
    })
    req.on('error', function (err) {
        console.log(err.toString());
    });
    req.end();
};


// Start server
app.listen(PORT, () => {
  console.log('Server listening on port: ' + PORT);
});

