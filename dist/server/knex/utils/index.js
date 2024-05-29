"use strict";

var Car = require('../models/Car');
// const photo = require('../models/Photo');
var User = require('../models/User');
var Role = require('../models/Role');
var TranportTypes = require('../models/TransportTypes');
var InOutInfo = require('../models/InOutInfo');

// InOutInfos - fields
// ... mandatory fields to INSERT
// car_number
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
  this.name = 'AuthException';
}
function addInOutInfos(carNumber, postData) {
  if (!postData) {
    throw new InOutInfoException('Not valid fields to insert record!');
  }

  // const m_fields = ['ttype_id', 'in_datetime', 'who_in_checked']
  // for (let index = 0; index < m_fields.length; index++) {
  //   const field = m_fields[index]
  //   if (!postData[field]) {
  //     throw new InOutInfoException('Invalid field [' + field + '] to insert info!')
  //   }
  // }

  return isCarExists(carNumber).then(function (car) {
    if (car) {
      return car.$relatedQuery('infos').insert(postData);
    } else {
      addNewCar(carNumber).then(function (car) {
        return car.$relatedQuery('infos').insert(postData);
      });
    }
  });
}
exports.addInOutInfos = addInOutInfos;
function updateInOutInfos(carNumber, infoId, postData) {
  if (!postData) {
    throw new InOutInfoException('Not valid fields to insert record!');
  }
  var m_fields = ['out_datetime', 'who_out_checked'];
  for (var index = 0; index < m_fields.length; index++) {
    var field = m_fields[index];
    if (!postData[field]) {
      throw new InOutInfoException('Invalid field [' + field + '] to update info!');
    }
  }
  return isCarExists(carNumber).then(function (car) {
    if (car) {
      return car.$relatedQuery('infos').findById(infoId).then(function (info) {
        if (info) {
          return info.$query().patch(postData);
        } else {
          throw new InOutInfoException("Car(Number: ".concat(carNumber, ") could not find Info(Id:").concat(infoId, ")"));
        }
      });
    } else {
      throw new InOutInfoException("Car(Number: ".concat(carNumber, ") not found for Info(Id:").concat(infoId, ")"));
    }
  });
}
exports.updateInOutInfos = updateInOutInfos;
function update1cInOutInfos(carNumber, infoId, postData) {
  if (!postData) {
    throw new InOutInfoException('Not valid fields to insert record!');
  }
  var m_fields = ['is_sent_to_1c', 'who_sent_to_1c'];
  for (var index = 0; index < m_fields.length; index++) {
    var field = m_fields[index];
    if (typeof postData[field] === 'undefined') {
      throw new InOutInfoException('Invalid field [' + field + '] to update info!');
    }
  }
  return isCarExists(carNumber).then(function (car) {
    if (car) {
      return car.$relatedQuery('infos').findById(infoId).then(function (info) {
        if (info) {
          return info.$query().patch(postData);
        } else {
          throw new InOutInfoException("Car(Number: ".concat(carNumber, ") could not find Info(Id:").concat(infoId, ")"));
        }
      });
    } else {
      throw new InOutInfoException("Car(Number: ".concat(carNumber, ") not found for Info(Id:").concat(infoId, ")"));
    }
  });
}
exports.update1cInOutInfos = update1cInOutInfos;
function getRoles() {
  return Role.query().select(['id', 'description']);
}
exports.getRoles = getRoles;
function getTransportTypes() {
  return TranportTypes.query();
}
exports.getTransportTypes = getTransportTypes;
function changeRole4User(postData) {
  return User.relatedQuery('roles')["for"](postData.userId).unrelate().then(function () {
    return User.relatedQuery('roles')["for"](postData.userId).relate(postData.roleId);
  });
}
exports.changeRole4User = changeRole4User;
function getAllUsers(columns) {
  return User.query().select(columns);
}
exports.getAllUsers = getAllUsers;
function isCarExists(carNumber) {
  return Car.query().findOne('number', carNumber);
}
exports.isCarExists = isCarExists;
function isIoInfoExists(ioInfoId) {
  return InOutInfo.query().findById(ioInfoId);
}
exports.isIoInfoExists = isIoInfoExists;
function DbException(message) {
  this.message = message;
  this.name = 'DbException';
}
function addUser(userData) {
  return User.query().insert(userData);
}
exports.addUser = addUser;
function addNewCar(carNumber) {
  if (!carNumber) {
    throw new DbException('Invalid car number!');
  } else {
    var car = Car.query().insert({
      number: carNumber
    });
    return car;
  }
}
exports.addNewCar = addNewCar;
function getPhotos(ioInfoId) {
  return InOutInfo.relatedQuery('photos')["for"](ioInfoId);
}
exports.getPhotos = getPhotos;
function addPhoto4ioInfoId(ioInfoId, photo) {
  return InOutInfo.relatedQuery('photos')["for"](ioInfoId).insert(photo);
}
exports.addPhoto4ioInfoId = addPhoto4ioInfoId;
function setFilters(q, filters) {
  if (filters.count) {
    q.count(filters.count);
  }
  if (filters.select) {
    q.select(filters.select);
  }
  if (filters.where) {
    q.where(filters.where);
  }
  if (filters.groupBy) {
    q.groupBy(filters.groupBy);
  }
  if (filters.limits) {
    q.limit(filters.limits);
  }
}
exports.setFilters = setFilters;