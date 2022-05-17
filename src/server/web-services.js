const utils = require('./utils');
const express = require('express');
const app = express();
app.use(express.json());

const cors = require('cors')
app.use(cors());

const path = require('path');
const dataPath = path.resolve(__dirname, '..', 'data');

console.warn('Data path defined as: ' + dataPath);

app.use(express.static(dataPath));

const _PORT = 8181;
app.get('/', (req, res) => {
    // downloadImageFromURL('http://kpp:Kpp_1234@192.168.4.150/ISAPI/Streaming/channels/101/picture?snapShotImageType=JPEG', 'kpp.jpeg');

    res.send('Hello from App Engine v4! _PORT: ' + _PORT);
});

app.post('/base64Jpeg2File', (request, response) => {
    console.log(request.body.dataURL.length);
    let base64String = request.body.dataURL;
    let base64Image = base64String.split(';base64,').pop();
    let myPath = utils.getImagesDirectory(dataPath,request.body.carNumber);
    if (utils.validateDir(myPath)) {
        let myFile = utils.getUniqueId(null,request.body.carState) + '.jpeg';
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

// Listen to the App Engine-specified port, or 8181 otherwise
const PORT = process.env.PORT || _PORT;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`);
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

