import { ymdFormateDate, getImageAccessUrl, string2Date, orgs } from "./common";
// function ymdFormateDate (date) {
//   const d = date || new Date()
//   let month = '' + (d.getMonth() + 1)
//   let day = '' + d.getDate()
//   const year = d.getFullYear()

//   if (month.length < 2) { month = '0' + month }
//   if (day.length < 2) { day = '0' + day }

//   return [year, month, day].join('-')
// };

// function getImageAccessUrl (carNumber, fileName, forDate) {
//   return ['photos', carNumber, ymdFormateDate(string2Date(forDate)), fileName].join('/')
// };

// function string2Date (dateString) {
//   if (dateString) {
//     const parts = dateString.split('-')
//     return new Date(parts[0], parts[1] - 1, parts[2])
//   }
//   return new Date()
// }

// export { ymdFormateDate, getImageAccessUrl, string2Date }
exports.ymdFormateDate = ymdFormateDate; // formateDate
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

  // let _result = (new Date()).valueOf();
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

// Detect current environment: [prod|test|development]
const NODE_ENV_TEST = "test";
const NODE_ENV_DEV = "development";
const NODE_ENV = (process.env.NODE_ENV || NODE_ENV_DEV).trim(); // We have error without trim() here, maybe we found some !!!BUGFIX!!!

console.log("API Server environment:", NODE_ENV);
function isDevEnvironment() {
  return NODE_ENV === NODE_ENV_DEV;
}
exports.isDevEnvironment = isDevEnvironment;

function isTestEnvironment() {
  return NODE_ENV === NODE_ENV_TEST;
}
exports.isTestEnvironment = isTestEnvironment;

function isProdEnvironment() {
  return !isDevEnvironment() && !isTestEnvironment();
}
exports.isProdEnvironment = isProdEnvironment;
