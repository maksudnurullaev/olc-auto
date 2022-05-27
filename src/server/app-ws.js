const utils = require('../utils/utils.js');
const express = require('express');
const WS_NAME = "OLC-KPP API Web-Service version";
const WS_VERSION = "0.0.1b";
const fs = require('fs');
// Define static file path
const path = require('path');

const app = express();
app.use(express.json());

// TODO: downloadImageFromURL('http://kpp:Kpp_1234@192.168.4.150/ISAPI/Streaming/channels/101/picture?snapShotImageType=JPEG', 'kpp.jpeg');
app.get('/', (request, response) => {
    response.sendFile(path.resolve(__dirname, '..', '..', 'dist', 'front', 'index.html'));
});

// get objection's Cars
const Cars = require('./knex/models/Car')
app.get('/cars', (request, response) => {
    Cars.query().then((cars) => {
        console.log('Found', cars.length, 'cars');
        response.json({ restul: true, cars: cars });
    });
});

app.get('/cars/:id', (req, res) => {
    const { id } = req.params;
    console.log("Car's ID:", id)
    try {
        const car = Cars.query().findById(id).then((car) => {
            if (!car) {
                // throw new Error('Car not found!');
                res.status(404).send({ result: false, message: "Car not found!" })
            } else {
                car.$relatedQuery('photos').then((photos) => {
                    if (photos) {
                        // console.log("Photos:", photos);
                        car['photos'] = photos;
                    }
                    res.status(200).send({ result: true, car: car });
                })
            }
            // res.status(200).send({ result: true, car: car });
        })
    } catch (error) {
        res.status(500).send({ result: false, message: error.message })
    }
});

// ... to photos
const path2Photos = path.resolve(__dirname, '..', '..', 'dist', 'photos');
app.post('/getImages', (request, response) => {
    let carID = request.body.carID;
    let forDate = request.body.forDate;
    if (!request.body.carID || !request.body.forDate) {
        response.status(400).send({ result: false, message: "Parameters are not properly defined!" });
        return;
    }
    let myPath = utils.getImagesDirectoryPath(path2Photos, carID, forDate);
    if (utils.validateDir(myPath)) {
        let imageUrls = [];
        fs.readdir(myPath, (err, files) => {
            files.forEach(file => {
                imageUrls.push(file);
                // console.log(file, imageUrls.length);
            });
            response.send({ result: true, imageUrls: imageUrls });
            console.log('Found', imageUrls.length, 'images');
        });
    } else {
        response.status(400).send({ result: false, errMessage: ("Couldn't implemented yet: " + myPath) });
    }
});


module.exports = app;