const utils = require('../utils/utils.js');
const express = require('express');
const WS_VERSION = "0.0.1b";
const WS_NAME = "OLC-KPP API Web-Service version";
const app = express();
app.use(express.json());

module.exports = app;

const cors = require('cors')
app.use(cors());

const path = require('path');
// const knex = path.resolve(__dirname, 'knex', 'knex.js')

// define DATA path
const dataPath = path.resolve(__dirname, '..', '..', 'data');
console.warn('Data path defined as:', dataPath);
console.warn('process.env.ENVIRONMENT:', process.env.ENVIRONMENT || 'development');

// add DATA folder to static serve (for images!)
app.use(express.static(dataPath));

// get objection's Cars
const Cars = require('./knex/models/Car')

// TODO: downloadImageFromURL('http://kpp:Kpp_1234@192.168.4.150/ISAPI/Streaming/channels/101/picture?snapShotImageType=JPEG', 'kpp.jpeg');
app.get('/', (req, res) => {
    res.send({ resut: true, message: WS_NAME + ": " + WS_VERSION });
});

app.get('/cars', (req, res) => {
    Cars.query().then((cars) => res.json(cars));
});

app.get('/cars/:id', (req, res) => {
    const { id } = req.params;
    console.warn("Car's ID:", id)
    try {
        const car = Cars.query().findById(id).then((car) => {
            if (!car) {
                throw new Error('Car not found!');
            }
            car.$relatedQuery('photos').then((photos) => {
                if (photos) {
                    console.log("Photos:", photos);
                    car['photos'] = photos;
                }
                res.status(200).send({ result: true, car: car });
            })
            // res.status(200).send({ result: true, car: car });
        })
    } catch (error) {
        res.status(404).send({ result: false, message: error.message })
    }
});

app.post('/base64Jpeg2File', (request, response) => {
    console.log(request.body.dataURL.length);
    let base64String = request.body.dataURL;
    let base64Image = base64String.split(';base64,').pop();
    let myPath = utils.getImagesDirectoryPath(dataPath, request.body.carNumber);
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

app.post('/getImages', (request, response) => {
    let carID = request.body.carID;
    let forDate = request.body.forDate;
    let myPath = utils.getImagesDirectoryPath(dataPath, carID, forDate);
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
        response.send({ result: false, errMessage: ("Couldn't implemented yet: " + myPath) });
    }
});

// ############### Web service part

var fs = require('fs'),
    http = require('http'),
    https = require('https');
const { TypePredicateKind } = require('typescript');
const { VERSION } = require('ts-node');

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

