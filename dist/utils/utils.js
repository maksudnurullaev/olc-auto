"use strict";

var _common = require("./common");
exports.ymdFormateDate = _common.ymdFormateDate;
exports.string2Date = _common.string2Date;
exports.getImageAccessUrl = _common.getImageAccessUrl;
exports.orgs = _common.orgs;
var path = require("path");
function getImagesDirectoryPath(path2Photos, carNumber, date) {
  return path.join(path2Photos, carNumber, (0, _common.ymdFormateDate)((0, _common.string2Date)(date)));
}
exports.getImagesDirectoryPath = getImagesDirectoryPath;
function getUniqueId(prefix, postfix) {
  var d = new Date();
  var _result = "H" + d.getHours() + "M" + d.getMinutes() + "S" + d.getSeconds() + "MS" + d.getMilliseconds();
  _result = prefix ? prefix + "-" + _result : "" + _result;
  _result = postfix ? _result + "-" + postfix : _result;
  return _result;
}
exports.getUniqueId = getUniqueId;
var fs = require("fs");
function validateDir(myPath) {
  if (fs.existsSync(myPath)) {
    console.log("Directory already exists: " + myPath);
    return true;
  } else {
    var myResult = fs.mkdirSync(myPath, {
      recursive: true
    }, function (err) {
      if (err) {
        console.error(err);
        return false;
      }
      console.log("Directory created successfully: " + myPath);
      return true;
    });
    console.log(myResult);
    return true;
  }
}
exports.validateDir = validateDir;