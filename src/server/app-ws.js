const utils = require('../utils/utils.js');
const express = require('express');
const WS_NAME = "OLC-KPP API Web-Service version";
const WS_VERSION = "0.0.1b";
const path = require('path');
const Fs = require('fs')
const Axios = require('axios')
const app = express();
const authUtils = require('./auth/utils');
const myCrypto = require('./crypto');
const dbUtils = require('./knex/utils');
const wsUtils = require('./utils/ws')

// Patch limit of size upload image
app.use(express.json({ extended: true, limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// express & session part - for auth
//   ... i.e.: https://www.codexpedia.com/node-js/a-very-basic-session-auth-in-node-js-with-express-js/
const session = require('express-session');
app.use(session({
    secret: 'WppQ38S-4D44-2C44',
    resave: true,
    saveUninitialized: true
}));

app.post('/getAllUsers', function (req, res) {
    console.log("Going to get all users");
    let _result = [];
    let _promises = [];
    dbUtils.getAllUsers(['id', 'description']).then((users) => {
        users.forEach((user) => {
            _promises.push(new Promise((resolve, reject) => {
                authUtils.getRoles(user).then((roles) => {
                    let _user = user.toJSON();
                    _user.roles = [];
                    roles.forEach((role) => {
                        _user.roles.push({ id: role.id, desc: role.description })
                    })
                    _result.push(_user);
                    // console.log("User found:", user.id);
                    resolve(_result);
                });
            }));
        });
        return Promise.all(_promises)
    }).then(() => {
        res.send({ result: true, users: _result });
    }).catch((err) => {
        res.send({ result: false, message: err });
    })
});

app.post('/addUser', function (req, res) {
    console.log("Going to add user");
    let userData = req.body;
    authUtils.addNewUserData(userData).then((user) => {
        res.send({ result: true, message: "Новый пользователь системы [" + user.id + '] создан успешно!' });
    }).catch((err) => {
        if( err && err.code == "SQLITE_CONSTRAINT_PRIMARYKEY"){
            res.send({ result: false, message: "Такой пользователь уже существует в базе данных!" });
        } else{
            console.error(err)
            res.send({ result: false, message: "Ошибка базы данных или сервера!" });
        }
    })
});


function auth(req, res, next) { //TODO: add it to test user rights
    if (req.session && req.session.user === "admin" && req.session.admin)
        return next();
    else
        return res.status(401).send({ result: false, message: "Вы не авторизованы!" });
};

app.post('/checkLogin', function (req, res) {
    if (req.session.user) {
        res.send({
            result: true,
            message: "login already done!",
            user: { id: req.session.user, role: req.session.userRole }
        });
    } else {
        res.send({
            result: false,
            message: "no-login!",
            user: { id: '', role: '' }
        });
    }
});

app.post('/changePassword', function (req, res) {
    console.log("Going to change user password!");
    if (!req.body.userId || !req.body.newUserPassword) {
        res.send({ result: false, message: 'Не заполнено поле пользователя или пароля!' });
    } else {
        let userId = req.body.userId,
            userPassword = req.body.newUserPassword;
        User.query().findById(userId).patch({
            hashedPassword: myCrypto.hashUserAndPassword(userId, userPassword)
        }).then(() => {
            console.log("User password successfully changed!");
            res.send({
                result: true,
                message: 'Password changed!'
            });
        }).catch((err) => {
            res.send({
                result: false,
                message: err.toString()
            });
        });
    }
});

app.post('/login', function (req, res) {
    let userId = req.body.id,
        userPassword = req.body.password;
    if (!userId || !userPassword) {
        res.send({ result: false, message: 'Не заполнено поле пользователя или пароля!' });
    } else if (userId === "admin") {
        authUtils.isUserExists('admin').then((user) => {
            if (!user) {
                wsUtils.loginAdminNew(userPassword, req, res);
            } else {
                wsUtils.loginUser(user, req.body.password, req, res);
            }
        });
    } else {
        authUtils.isUserExists(userId).then((user) => {
            if (user) {
                wsUtils.loginUser(user, userPassword, req, res);
            } else {
                res.send({
                    result: false,
                    message: "User not found!"
                });
            }
        });
    }
});

// Logout endpoint
app.post('/logout', function (req, res) {
    req.session.destroy();
    res.send({ result: true, message: "logout success!", user: { id: '', role: '' } });
});

function getModuleInfo() {
    return WS_NAME + ': ' + WS_VERSION;
}

// TODO: downloadImageFromURL('http://kpp:Kpp_1234@192.168.4.150/ISAPI/Streaming/channels/101/picture?snapShotImageType=JPEG', 'kpp.jpeg');
app.get('/', (request, response) => {
    response.sendFile(path.resolve(__dirname, '..', '..', 'dist', 'front', 'index.html'));
});

// get objection's Cars
const Cars = require('./knex/models/Car');
const User = require('./knex/models/User.js');
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
        Cars.query().findById(id).then((car) => {
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
    if (!carID || !forDate) {
        response.status(400).send({ result: false, message: "Parameters are not properly defined!" });
        return;
    }
    let myPath = utils.getImagesDirectoryPath(path2Photos, carID, forDate);
    if (utils.validateDir(myPath)) {
        let imageUrls = [];
        Fs.readdir(myPath, (err, files) => {
            files.forEach(file => {
                imageUrls.push(file);
                // console.log(file, imageUrls.length);
            });
            response.send({ result: true, imageUrls: imageUrls });
            console.log('Found', imageUrls.length, 'images for:', carID);
        });
    } else {
        response.status(400).send({ result: false, errMessage: ("Couldn't implemented yet: " + myPath) });
    }
});

app.post('/getCameraImage', (request, response) => {
    let carID = request.body.carID,
        forDate = request.body.forDate,
        cameraIp = request.body.cameraIp,
        carState = request.body.carState;
    console.log("Get image:");
    console.log(" ... for carID:", carID);
    console.log(" ... for date:", forDate);
    console.log(" ... from camera IP:", cameraIp);
    console.log(" ... with car state:", carState);
    if (!carID || !forDate || !cameraIp || !carState) {
        response.status(400).send({ result: false, message: "Parameters are not properly defined!" });
        return;
    }
    let myPath = utils.getImagesDirectoryPath(path2Photos, carID, forDate);
    if (utils.validateDir(myPath)) {
        let myFile = utils.getUniqueId(null, request.body.carState) + '.jpeg';
        let myPath2File = path.join(myPath, myFile);

        let imageUrl = utils.isDevEnvironment() ?
            'https://via.placeholder.com/1200x800/'
            + (carState.indexOf('In') == 0 ? '008000' : '0000FF')
            + '/808080.JPEG?text=OLC+KPP+Test-Image\n' + myFile :
            'http://kpp:Kpp_1234@' + cameraIp + '/ISAPI/Streaming/channels/101/picture?snapShotImageType=JPEG'

        downloadImageFromURL(imageUrl, myPath2File, () => { console.log('done'); })
            .then(() => {
                dbUtils.isCarExists(carID).then((car) => {
                    if (car) {
                        dbUtils.addPhoto4Car(carID, { url: myFile, date_ymd: forDate }).then((photo) => {
                            response.send({ result: true, imageUrl: myFile });
                        }).catch((err) => {
                            response.send({ result: false, message: err });
                        })
                    } else {
                        dbUtils.addNewCar(carID, carState).then((car) => {
                            dbUtils.addPhoto4Car(carID, { url: myFile, date_ymd: forDate }).then((photo) => {
                                response.send({ result: true, imageUrl: myFile });
                            }).catch((err) => {
                                response.send({ result: false, message: err });
                            })
                        });
                    }
                });
            })
            .catch((err) => response.send({ result: false, message: err }));
    } else {
        console.log("Couldn't validate path: " + myPath);
        response.send({ result: false, errMessage: ("Couldn't validate path: " + myPath) });
    }
});

// ############### Web service part

async function downloadImageFromURL(url, path, callback) {
    console.log('Image from url: ' + url);
    console.log(' ... we going to saved as: ' + path);
    const writer = Fs.createWriteStream(path)

    const response = await Axios({
        url,
        method: 'GET',
        responseType: 'stream'
    })

    response.data.pipe(writer)

    return new Promise((resolve, reject) => {
        writer.on('finish', resolve)
        writer.on('error', reject)
    })
}

module.exports = app;