const path = require('path')
var fs = require('fs');
const utils = require('../utils/utils.js');
var http = require('http');
var https = require('https');
var express = require('express');

// setup SSL for https
const credentials = {
    key: fs.readFileSync(path.resolve(__dirname, '..', '..', 'ssl', 'key.pem')),
    cert: fs.readFileSync(path.resolve(__dirname, '..', '..', 'ssl', 'cert.pem'))
};
// ##################### SSL-header part of module

const app = require("./app-ws");

// ... just for DEVELOPMENT-CORS using from localhost
if (utils.isDevEnvironment() || utils.isTestEnvironment()) {
    const cors = require('cors')
    app.use(cors());
    console.warn("!!!WARNING!!! We're using CORS just for DEVELOPMENT!");
}

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

// Disable HTTP
// var httpServer = http.createServer(app); 

// SSL-footer part of module
var httpsServer = https.createServer(credentials, app);

// Disable HTTP
// httpServer.listen(8080, () => { // we switch off it - camers don't works without https(ssl)
//     console.log('http - listen for 8080 port')
// });

// redirect all unmatched to ROOT path
app.use((req, res) => {
    res.redirect("/");
});

// HTTPS listener
httpsServer.listen(8443, () => {
    console.log('https - listen for 8443 port')
});
