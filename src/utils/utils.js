import { commonFormateDate, getImageAccessUrl, string2Date } from './common';

const path = require('path');

exports.formateDate = commonFormateDate;
exports.string2Date = string2Date; 
exports.getImageAccessUrl = getImageAccessUrl;

function getImagesDirectoryPath(dataPath, carNumber, date) {
    return path.join(dataPath, '..', 'data', 'cars', carNumber, commonFormateDate(string2Date(date)));
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

