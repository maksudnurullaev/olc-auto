function dmyFormatedDate() {
  const d = new Date()
  let month = '' + (d.getMonth() + 1)
  let day = '' + d.getDate()
  const year = d.getFullYear()

  if (month.length < 2) { month = '0' + month }
  if (day.length < 2) { day = '0' + day }

    return [day, month, year].join("")
}

function ymdFormateDate(date, withTimePart) {
  const d = date || new Date()
  let month = '' + (d.getMonth() + 1)
  let day = '' + d.getDate()
  const year = d.getFullYear()

  if (month.length < 2) { month = '0' + month }
  if (day.length < 2) { day = '0' + day }

  if (!withTimePart) {
    return [year, month, day].join('-')
  }

  let hours = d.getHours()
  // hours = hours < 10 ? '' + hours : '0' + hours
  let minutes = d.getMinutes()
  // minutes = minutes < 10 ? '' + minutes : '0' + minutes
  let seconds = d.getSeconds()
  // seconds = seconds < 10 ? '' + seconds : '0' + seconds
  return [year, month, day].join('-') + ' ' + [hours, minutes, seconds].join(':')
};

function getImageAccessUrl(carNumber, fileName, forDate) {
  return ['photos', carNumber, ymdFormateDate(string2Date(forDate)), fileName].join('/')
};

function string2Date(dateString) {
  if (dateString) {
    const parts = dateString.split('-')
    return new Date(parts[0], parts[1] - 1, parts[2])
  }
  return new Date()
}

function getImageClass(fileName) {
  if (fileName) {
    var result = fileName.match(/.*-(.*).jpeg/);
    return (result[1]);
  }
  return 'NaN';
};

function isProdMode(){
  return process.env.NODE_ENV && process.env.NODE_ENV === 'production';
}
function isDevMode(){
  return !isProdMode();
}

function getNodeMode(){
  return process.env.NODE_ENV || 'development';
}

export { ymdFormateDate, getImageAccessUrl, string2Date, getImageClass, dmyFormatedDate, isDevMode, getNodeMode }
