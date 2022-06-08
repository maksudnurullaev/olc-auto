const Car = require('../models/Car');
// const photo = require('../models/Photo');
const User = require('../models/User');
const Role = require('../models/Role');
const TranportTypes = require('../models/TransportTypes');

function getRoles(){
    return Role.query().select(['id', 'description']);
}
exports.getRoles = getRoles;

function getTransportTypes(){
    return TranportTypes.query();
}
exports.getTransportTypes = getTransportTypes;

function changeRole4User(postData){
    return User.relatedQuery('roles').for(postData.userId).unrelate().then(() => {
        return User.relatedQuery('roles').for(postData.userId).relate(postData.roleId);
    });
}
exports.changeRole4User = changeRole4User;

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