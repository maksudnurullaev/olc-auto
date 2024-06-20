const path = require('path')
const fs = require('fs')
const utils = require('../utils/utils.js')
const express = require('express')
const dbUtils = require('./knex/utils')

const MODE = process.env.NODE_ENV || 'development'

console.log("====CURRENT MODE====");
console.log(MODE);
console.log("====================");

// ... to front files
const path2Front = path.resolve(__dirname, '..', '..', 'dist', 'front')
console.log('Path to front: ' + path2Front)
// ... to photos
const path2Photos = path.resolve(__dirname, '..', '..', 'dist', 'photos')
console.log('Path to photos: ' + path2Photos)
if (!fs.existsSync(path2Photos)) {
  fs.mkdirSync(path2Photos)
  console.log('... just created!')
}

// ... to db files
const path2DbFiles = path.resolve(__dirname, '..', '..', 'dist', 'db')
console.log('Path to DB files: ' + path2DbFiles)
if (!fs.existsSync(path2DbFiles)) {
  fs.mkdirSync(path2DbFiles)
  console.log('... just created!')
}

// redirect all unmatched to ROOT path
const app = require('./app-ws')

app.use('/', express.static(path2Front))
//app.use('/assets', express.static(path2Front + '/assets'))
app.use('/photos', express.static(path2Photos))

// Save incoming image
app.post('/base64Jpeg2File', (request, response) => {
  const carNumber = request.body.carNumber
  const infoId = request.body.infoId
  const forDate = request.body.forDate
  const carState = request.body.carState
  if (!carNumber || !infoId || !forDate || !carState) {
    response.status(400).send({ result: false, message: 'Parameters are not properly defined!' })
    return
  }
  console.log('Get device camera image:')
  console.log(' ...          for carID:', carNumber)
  console.log(' ...           for date:', forDate)
  console.log(' ...     with car state:', carState)
  console.log(' ...         image size:', request.body.dataURL.length)
  const base64String = request.body.dataURL
  const base64Image = base64String.split(';base64,').pop()
  const myPath = utils.getImagesDirectoryPath(path2Photos, carNumber, forDate)
  if (utils.validateDir(myPath)) {
    const myFile = utils.getUniqueId(null, carState) + '.jpeg'
    const myPath2File = path.join(myPath, myFile)
    console.log('File going to be saved as: ' + myPath2File)
    fs.writeFile(myPath2File, base64Image, { encoding: 'base64' }, function (err) {
      if (err) {
        console.error(err)
        response.send({ result: false, errMessage: err.toString() })
      } else {
        console.log('File saved:', myPath2File)
        if (!request.body.infoId) {
          response.send({ result: true, message: "Invalid infoId to add photos!" })
        } else {
          dbUtils.addPhoto4ioInfoId(infoId, { url: myFile }).then((photo) => {
            response.send({ result: true, photo: photo })
          }).catch((err) => {
            response.send({ result: false, message: err.message })
          })
        }
      }
    })
  } else {
    console.log("Couldn't validate path: " + myPath)
    response.send({ result: false, errMessage: ("Couldn't validate path: " + myPath) })
  }
})

app.use((req, res) => {
  res.redirect('/')
});

if (MODE === 'development') {
  var errorhandler = require('errorhandler')
  app.use(errorhandler());
}

if (MODE === 'development') {
  const cors = require('cors')
  app.use(cors())
  console.log("CORS: This is CORS-enabled for all origins (development)!")

  const https = require('https')
  // setup SSL for https
  const credentials = {
    key: fs.readFileSync(path.resolve(__dirname, '..', '..', 'ssl', 'key.pem')),
    cert: fs.readFileSync(path.resolve(__dirname, '..', '..', 'ssl', 'cert.pem'))
  }
  
  const httpsServer = https.createServer(credentials, app)
  httpsServer.listen(8443, () => {
    console.log('https(development) - listen for 8443 port')
  })
} else {
  var httpServer = http.createServer(app);
  httpServer.listen(8080, () => { // we switch off it - camers don't works without https(ssl)
    console.log('http(' + MODE + ') - listen for 8080 port')
  });

}


