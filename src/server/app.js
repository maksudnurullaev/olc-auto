const fs = require('fs');
const utils = require('../utils/utils.js');
const express = require('express');
const app = require("./app-ws");
const PORT = process.env.PORT || 8181;

// ... just for DEVELOPMENT-CORS using from localhost
if (utils.isDevEnvironment() || utils.isTestEnvironment()) {
    const cors = require('cors')
    app.use(cors());
    console.warn("!!!WARNING!!! We're using CORS just for DEVELOPMENT!");
}

// Define static file path
const path = require('path');
// ... to front files
const path2Front = path.resolve(__dirname, '..', '..', 'dist', 'front');
console.log('Path to front: ' + path2Front);
app.use('/', express.static(path2Front));
// ... to photos
const path2Photos = path.resolve(__dirname, '..', '..', 'dist', 'photos');
console.log('Path to photos: ' + path2Photos);
app.use('/photos', express.static(path2Photos));

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
        fs.writeFile(myPath2FiFle, base64Image, { encoding: 'base64' }, function (err) {
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

// Start server
app.listen(PORT, () => {
    console.log('Server listening on port: ' + PORT);
});

