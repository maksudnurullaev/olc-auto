const path = require('path')
const fs = require('fs')
const utils = require('../utils/utils.js')
const https = require('https')
const express = require('express')
const dbUtils = require('./knex/utils')
const cors = require('cors')

if (utils.isDevEnvironment()){
  console.log("!!!DEVELOPMENT MODE!!!")
}

// setup SSL for https
const credentials = {
  key: fs.readFileSync(path.resolve(__dirname, '..', '..', 'ssl', 'key.pem')),
  cert: fs.readFileSync(path.resolve(__dirname, '..', '..', 'ssl', 'cert.pem'))
}
// ##################### SSL-header part of module 

const app = require('./app-ws')
app.use(cors())

// ... to front files
const path2Front = path.resolve(__dirname, '..', '..', 'dist', 'front')
console.log('Path to front: ' + path2Front)
app.use('/', express.static(path2Front))
// ... to photos
const path2Photos = path.resolve(__dirname, '..', '..', 'dist', 'photos')
console.log('Path to photos: ' + path2Photos)
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

// Disable HTTP
// var httpServer = http.createServer(app);

// SSL-footer part of module
const httpsServer = https.createServer(credentials, app)

// Disable HTTP
// httpServer.listen(8080, () => { // we switch off it - camers don't works without https(ssl)
//     console.log('http - listen for 8080 port')
// });

// redirect all unmatched to ROOT path
app.use((req, res) => {
  res.redirect('/')
})

// HTTPS listener
httpsServer.listen(8443, () => {
  console.log('https - listen for 8443 port')
})
