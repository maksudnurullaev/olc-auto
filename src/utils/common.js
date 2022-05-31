function commonFormateDate(date) {
    var d = date ? date : new Date(),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    return [year, month, day].join('-');
};

function getImageAccessUrl(carNumber, fileName, forDate) {
    return ['photos',carNumber, commonFormateDate(string2Date(forDate)), fileName].join('/');
};

function string2Date(dateString) {
    if (dateString) {
        var parts = dateString.split('-');
        return new Date(parts[0], parts[1] - 1, parts[2]);
    }
    return new Date();
}
// const utils = require('./utils')
// var commonFormateDate = utils.formateDate;
// var getImageAccessUrl= utils.getImageAccessUrl;
// var string2Date = utils.string2Date;
export { commonFormateDate, getImageAccessUrl, string2Date }