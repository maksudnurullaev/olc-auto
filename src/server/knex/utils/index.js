const Car = require('../models/Car');
// const photo = require('../models/Photo');
const User = require('../models/User');

function getAllUsers(columns){
    return User.query().select(columns);
}
exports.getAllUsers = getAllUsers;

function isCarExists(carId) {
    return Car.query().findById(carId);
}
exports.isCarExists = isCarExists

function DbException(message) {
    this.message = message;
    this.name = "DbException";
}

function addUser(userData){
    return User.query().insert(userData)
}
exports.addUser = addUser;

function addNewCar(carId, carState) {
    if (!carId || !carState) {
        throw new DbException("Empty user or password!");
    } else {
        const car = Car.query().insert({
            id: carId,
            state: carState
        })
        return car;
    }
}
exports.addNewCar = addNewCar

function getPhotos(carId) {
    return Car.relatedQuery('photos').for(carId);
}
exports.getPhotos = getPhotos;

function getPhotos4Date(carId, date) {
    return Car.relatedQuery('photos').for(carId).where('date', date);
}
exports.getPhotos4Date = getPhotos4Date;

function addPhoto4Car(carId, photo) {
    return Car.relatedQuery('photos').for(carId).insert(photo);
}
exports.addPhoto4Car = addPhoto4Car;