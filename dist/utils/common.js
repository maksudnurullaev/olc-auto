"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getImageAccessUrl = getImageAccessUrl;
exports.getImageClass = getImageClass;
exports.string2Date = string2Date;
exports.ymdFormateDate = ymdFormateDate;
function ymdFormateDate(date, withTimePart) {
  var d = date || new Date();
  var month = '' + (d.getMonth() + 1);
  var day = '' + d.getDate();
  var year = d.getFullYear();
  if (month.length < 2) {
    month = '0' + month;
  }
  if (day.length < 2) {
    day = '0' + day;
  }
  if (!withTimePart) {
    return [year, month, day].join('-');
  }
  var hours = d.getHours();
  // hours = hours < 10 ? '' + hours : '0' + hours
  var minutes = d.getMinutes();
  // minutes = minutes < 10 ? '' + minutes : '0' + minutes
  var seconds = d.getSeconds();
  // seconds = seconds < 10 ? '' + seconds : '0' + seconds
  return [year, month, day].join('-') + ' ' + [hours, minutes, seconds].join(':');
}
;
function getImageAccessUrl(carNumber, fileName, forDate) {
  return ['photos', carNumber, ymdFormateDate(string2Date(forDate)), fileName].join('/');
}
;
function string2Date(dateString) {
  if (dateString) {
    var parts = dateString.split('-');
    return new Date(parts[0], parts[1] - 1, parts[2]);
  }
  return new Date();
}
function getImageClass(fileName) {
  if (fileName) {
    var result = fileName.match(/.*-(.*).jpeg/);
    return result[1];
  }
  return 'NaN';
}
;