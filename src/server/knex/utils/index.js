const Car = require('../models/Car');
// const photo = require('../models/Photo');
const User = require('../models/User');
const Role = require('../models/Role');
const TranportTypes = require('../models/TransportTypes');
const InOutInfo = require('../models/InOutInfo');

// InOutInfos - fields
// ... mandatory fields to INSERT
// car_id
// ttype_id
// in_datetime
// who_in_checked
// ... mandatory fields to UPDATE
// out_datetime
// who_out_checked
// ... other filds
// code
// contragent
// driver_phone
// comment
// is_sent_to_1c
// who_sent_to_1c

function InOutInfoException(message) {
    this.message = message;
    this.name = "AuthException";
}

function addInOutInfos(postData) {
    if (!postData) {
        throw new InOutInfoException("Not valid fields to insert record!");
    }

    let m_fields = ['car_id', 'ttype_id', 'in_datetime', 'who_in_checked']
    for (let index = 0; index < m_fields.length; index++) {
        const field = m_fields[index];
        if (!postData[field]) {
            throw new InOutInfoException("Not valid field [" + field + "] to insert record!");
        }
    }

    return isCarExists(postData['car_id']).then((car) => {
        if (car) {
            return InOutInfo.query().insert(postData);
        } else {
            addNewCar(carID).then((car) => {
                return InOutInfo.query().insert(postData);
            });
        }
    }).catch((err) => response.send({ result: false, message: err }));
}
exports.addInOutInfos = addInOutInfos;

function getRoles() {
    return Role.query().select(['id', 'description']);
}
exports.getRoles = getRoles;

function getTransportTypes() {
    return TranportTypes.query();
}
exports.getTransportTypes = getTransportTypes;

function changeRole4User(postData) {
    return User.relatedQuery('roles').for(postData.userId).unrelate().then(() => {
        return User.relatedQuery('roles').for(postData.userId).relate(postData.roleId);
    });
}
exports.changeRole4User = changeRole4User;

function getAllUsers(columns) {
    return User.query().select(columns);
}
exports.getAllUsers = getAllUsers;

function isCarExists(carId) {
    return Car.query().findOne('number', carId);
}
exports.isCarExists = isCarExists

function isIoInfoExists(ioInfoId) {
    return InOutInfo.query().findById(ioInfoId);
}
exports.isIoInfoExists = isIoInfoExists


function DbException(message) {
    this.message = message;
    this.name = "DbException";
}

function addUser(userData) {
    return User.query().insert(userData)
}
exports.addUser = addUser;

function addNewCar(carId) {
    if (!carId) {
        throw new DbException("Invalid car number!");
    } else {
        const car = Car.query().insert({
            number: carId
        })
        return car;
    }
}
exports.addNewCar = addNewCar

function getPhotos(ioInfoId) {
    return InOutInfo.relatedQuery('photos').for(ioInfoId);
}
exports.getPhotos = getPhotos;

function addPhoto4ioInfoId(ioInfoId, photo) {
    return InOutInfo.relatedQuery('photos').for(ioInfoId).insert(photo);
}
exports.addPhoto4ioInfoId = addPhoto4ioInfoId;

function setFilters(q, filters){
    if (filters.count) {
        q.count(filters.count)
    }
    if(filters.select) {
        q.select(filters.select);
    }
    if (filters.where) {
        q.where(filters.where[0], filters.where[1]);
    }
    if (filters.groupBy) {
        q.groupBy(filters.groupBy)
    }
}
exports.setFilters = setFilters;