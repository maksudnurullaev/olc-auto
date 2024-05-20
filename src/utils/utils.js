import { ymdFormateDate, getImageAccessUrl, string2Date, orgs } from "./common";
import process from 'node:process';

exports.ymdFormateDate = ymdFormateDate;
exports.string2Date = string2Date;
exports.getImageAccessUrl = getImageAccessUrl;
exports.orgs = orgs;

const path = require("path");

function getImagesDirectoryPath(path2Photos, carNumber, date) {
  return path.join(path2Photos, carNumber, ymdFormateDate(string2Date(date)));
}
exports.getImagesDirectoryPath = getImagesDirectoryPath;

function getUniqueId(prefix, postfix) {
  const d = new Date();
  let _result =
    "H" +
    d.getHours() +
    "M" +
    d.getMinutes() +
    "S" +
    d.getSeconds() +
    "MS" +
    d.getMilliseconds();

  _result = prefix ? prefix + "-" + _result : "" + _result;
  _result = postfix ? _result + "-" + postfix : _result;
  return _result;
}
exports.getUniqueId = getUniqueId;

const fs = require("fs");
function validateDir(myPath) {
  if (fs.existsSync(myPath)) {
    console.log("Directory already exists: " + myPath);
    return true;
  } else {
    const myResult = fs.mkdirSync(myPath, { recursive: true }, (err) => {
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

const NODE_ENV_DEV = "development";
const NODE_ENV = (process.env.NODE_ENV || NODE_ENV_DEV).trim(); // We have error without trim() here, maybe we found some !!!BUGFIX!!!

console.log("API Server environment:", NODE_ENV);
function isDevEnvironment() {
  return NODE_ENV === NODE_ENV_DEV;
}
exports.isDevEnvironment = isDevEnvironment;

function isProdEnvironment() {
  return !isDevEnvironment();
}
exports.isProdEnvironment = isProdEnvironment;
