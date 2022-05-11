const express = require('express');
const app = express();
const path = require('path');

app.use(express.json());
const dataPath = path.resolve(__dirname, '..', 'data');
console.warn('Data path defined as: ' + dataPath);
app.use(express.static(dataPath));

app.get('/', (req, res) => {
    // downloadImageFromURL('http://kpp:Kpp_1234@192.168.4.150/ISAPI/Streaming/channels/101/picture?snapShotImageType=JPEG', 'kpp.jpeg');

    res.send('Hello from App Engine!');
});


app.post('/base64Jpeg2File', (request, response) => {
    console.log(request.body.dataURL.length);
    let base64String = request.body.dataURL;
    let base64Image = base64String.split(';base64,').pop();
    let myPath = getImagesDirectory(request.body.carNumber);
    if (validateDir(myPath)) {
        let myFile = getUniqueId(null,request.body.carState) + '.jpeg';
        let myPath2File = path.join(myPath, myFile);
        console.log('File going to be saved as: ' + myPath2File);
        fs.writeFile(myPath2File, base64Image, { encoding: 'base64' }, function (err) {
            if (err) {
                console.error(err)
                response.send({ result: false, errMessage: err.toString() });
            } else {
                console.log('File saved:', myPath2File);
                let _imageUrl = getImageAccessUrl(request.body.carNumber, myFile);
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
const PORT = process.env.PORT || 8181;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`);
});

// ############### Web service part

var fs = require('fs'),
    http = require('http'),
    https = require('https');

function getImageAccessUrl(carNumber, fileName, forDate) {
    return ['cars', carNumber, formatDate(forDate), fileName].join('/');
}

function getImagesDirectory(carNumber, forDate, forDate) {
    return path.join(__dirname, '..', 'data', 'cars', carNumber, formatDate(forDate));
}

function formatDate(date) {
    var d = date ? new Date(date) : new Date(),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    return [year, month, day].join('-');
}

function getUniqueId(prefix, postfix) {
    let _result = (new Date()).valueOf();
    _result = prefix ? prefix + '-' + _result : '' + _result;
    _result = postfix ? _result + '-' + postfix : _result;
    return _result;
}

function validateDir(myPath) {
    if (fs.existsSync(myPath)) {
        console.log("Directory already exists: " + myPath);
        return true;
    } else {
        let myResult = fs.mkdirSync(myPath,
            { recursive: true }, (err) => {
                if (err) {
                    console.error(err);
                    return false;
                }
                console.log('Directory created successfully: ' + myPath);
                return true;
            });
        console.log(myResult);
        return true
    }
}


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

