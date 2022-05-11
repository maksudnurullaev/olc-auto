const express = require('express');
const app = express();
app.use(express.json());

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
        let myFile = getUniqueId();
        let myPath2File = path.join(myPath, myFile + '.jpeg');
        console.log('File going to be saved as: ' + myPath2File);
        fs.writeFile(myPath2File, base64Image, { encoding: 'base64' }, function (err) {
            if (err) {
                console.error(err)
                response.send({ result: false, errMessage: err.toString() });
            } else {
                console.log('File saved:', myPath2File);
                response.send({ result: true });
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
    https = require('https'),
    path = require('path');

function getImagesDirectory(carNumber, forDate) {
    return path.join(__dirname, 'data', 'cars', carNumber, formatDate(forDate));
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

function getUniqueId() {
    return (new Date()).valueOf();
}

function validateDir(myPath) {
    // let myPath = getImagesDirectory(carNumber);
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

