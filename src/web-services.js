const express = require('express');
const app = express();

app.get('/', (req, res) => {
    // downloadImageFromURL('http://kpp:Kpp_1234@192.168.4.150/ISAPI/Streaming/channels/101/picture?snapShotImageType=JPEG', 'kpp.jpeg');

    res.send('Hello from App Engine!');
});


app.post('/base64Jpeg2File', (request,response) => {
    console.log(request.body);
    response.end('base64Jpeg2File - done');
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

