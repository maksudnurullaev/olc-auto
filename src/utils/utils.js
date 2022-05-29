import { commonFormateDate, getImageAccessUrl, string2Date } from './common';
exports.formateDate = commonFormateDate;
exports.string2Date = string2Date; 
exports.getImageAccessUrl = getImageAccessUrl;

const path = require('path');

function getImagesDirectoryPath(path2Photos, carNumber, date) {
    return path.join(path2Photos, carNumber, commonFormateDate(string2Date(date)));
}
exports.getImagesDirectoryPath = getImagesDirectoryPath;

function getUniqueId(prefix, postfix) {
    var d = new Date(),
        _result = 'H' + d.getHours() 
        + 'M' + d.getMinutes() 
        + 'S' + d.getSeconds()
        + 'MS' + d.getMilliseconds();

    // let _result = (new Date()).valueOf();
    _result = prefix ? prefix + '-' + _result : '' + _result;
    _result = postfix ? _result + '-' + postfix : _result;
    return _result;
}
exports.getUniqueId = getUniqueId;

var fs = require('fs');
function validateDir(myPath) {
    if (fs.existsSync(myPath)) {
        console.log("Directory already exists: " + myPath);
        return true;
    } else {
        let myResult = fs.mkdirSync(myPath,
            { recursive: true }, (err) => {
                if (err) {
                    console.error(err);
                    return false;
                }
                console.log('Directory created successfully: ' + myPath);
                return true;
            });
        console.log(myResult);
        return true
    }
}
exports.validateDir = validateDir;

// Detect current environment: [prod|test|development]
const NODE_ENV_TEST = 'test';
const NODE_ENV_DEV = 'development';
const NODE_ENV = (process.env.NODE_ENV || NODE_ENV_DEV).trim(); // Why trim() maybe !!!BUGFIX!!!

console.log('API Server environment:', NODE_ENV);
function isDevEnvironment(){
   return (NODE_ENV === NODE_ENV_DEV) 
}
exports.isDevEnvironment = isDevEnvironment;

function isTestEnvironment(){
   return (NODE_ENV === NODE_ENV_TEST) 
}
exports.isTestEnvironment = isTestEnvironment;

function isProdEnvironment(){
    return (!isDevEnvironment() && !isTestEnvironment()) 
 }
 exports.isProdEnvironment = isProdEnvironment;