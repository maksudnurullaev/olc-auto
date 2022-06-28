import axios from 'axios'

import { getImageAccessUrl } from '../../utils/common'

function wsGetCarInfos4Date(globals) {
  const car = globals.car.current_number
  const forDate = globals.car.forDate
  if (!car) {
    alert('Нет номера авто!')
    return
  }
  if (!forDate) {
    alert('Нет даты!')
    return
  }
  const filter = {
    where: {'date_ymd': forDate}
  }

  return axios.post(globals.getWebServiceURL + `cars/${car}/infos`, filter).then((response) => {
    globals.car.infos = []
    if (response.data.result) {
      if (response.data.car && response.data.car.infos) {
        globals.car.infos = response.data.car.infos
        if (globals.car.infos.length == 1) {
          globals.setCarInfoID(response.data.car.infos[0].id)
        } else {
          globals.setCarInfoID(0)
        }
      } else {
        globals.setCarInfoID(0)
      }
    } else {
      globals.setCarInfoID(0)
      console.warn(response.data.message)
    }
  })
}

function wsGetCarInfosDates(globals) {
  const car = globals.car.current_number
  if (!car) {
    alert('На заполнено номера авто!')
  }

  const filter = {
    count: '* as records',
    select: 'date_ymd',
    groupBy: 'date_ymd'
  }

  axios.post(globals.getWebServiceURL + `cars/${car}/infos`, filter).then((response) => {
    globals.car.infosByDates = []
    if (response.data.result) {
      if (response.data.car && response.data.car.infos) {
        for (let index = 0; index < response.data.car.infos.length; index++) {
          globals.car.infosByDates.push(response.data.car.infos[index])
        }
      } else {
        globals.car.infos = []
        globals.car.infoCurrentId = 0
      }
    } else {
      globals.car.infos = []
      globals.car.infoCurrentId = 0
      console.warn(response.data.message)
    }
  })
}

function wsGetRoles(globals, pageResources) {
  axios.post(globals.getWebServiceURL + 'getRoles').then(function (response) {
    if (response.data.result) {
      pageResources.roles = response.data.roles
      response.data.roles.forEach((role) => {
        pageResources.rolesMap[role.id] = role.description
      })
    }
  })
}

function wsGetTransportTypes(globals) {
  if (!globals.car.form.transportTypes.length) {
    axios.post(globals.getWebServiceURL + 'getTransportTypes').then(function (response) {
      if (response.data.result) {
        globals.car.form.transportTypes = response.data.transportTypes
        response.data.transportTypes.forEach((ttype) => {
          globals.car.form.codeLengthLimits[ttype.id] = ttype.code_length
        })
      }
    })
  } else {
    console.log('Trasnports types already loaded!')
  }
}

function wsChangeRole4User(globals, postData) {
  axios.post(globals.getWebServiceURL + 'changeRole4User', postData).then(function (response) {
    console.log(response.data.message)
    if (response.data.result) {
      alert('Роль для пользователя измернен!')
    } else {
      alert('Ошибка сервера!')
    }
  })
}

function wsGetAllUsers(globals, pageResources) {
  axios.post(globals.getWebServiceURL + 'getAllUsers')
    .then(function (response) {
      if (response.data.result) {
        pageResources.users = response.data.users
      } else {
        if (response.data.message) {
          alert(response.data.message)
        } else {
          console.warn('Get all users: error!')
        }
        return []
      }
    })
    .catch(function (error) {
      console.log(error)
      return []
    })
}

function wsLogout(globals) {
  axios.post(globals.getWebServiceURL + 'logout')
    .then(function (response) {
      if (response.data.result) {
        globals.resetAll()
      } else {
        if (response.data.message) {
          alert(response.data.message)
        } else {
          console.warn('Logout error!')
        }
      }
    })
    .catch(function (error) {
      console.log(error)
    })
}

function wsCheckLogin(globals) {
  axios.post(globals.getWebServiceURL + 'checkLogin')
    .then(function (response) {
      if (response.data.result) {
        console.log(response.data.message)
        globals.user = response.data.user
      } else {
        if (response.data.message) {
          console.warn(response.data.message)
        }
      }
    })
    .catch(function (error) {
      console.log(error)
    })
}

function wsAddUser(userData, globals) {
  return axios.post(globals.getWebServiceURL + 'addUser', userData)
}

function wsUpdateUser(userData, globals) {
  return axios.post(globals.getWebServiceURL + 'updateUser', userData)
}

function wsChangePassword(userData, globals) {
  const postData = { userId: userData.userId, newUserPassword: userData.newUserPassword }
  return axios.post(globals.getWebServiceURL + 'changePassword', postData)
}

function wsLogin(userData, globals) {
  const postData = {
    id: userData.id,
    password: userData.password
  }
  // console.log(postData);
  axios.post(globals.getWebServiceURL + 'login', postData)
    .then(function (response) {
      if (response.data.result) {
        console.log(response.data.message)
        globals.user = response.data.user
      } else {
        if (response.data.message) {
          alert(response.data.message)
        } else {
          console.warn('Authorization error!')
        }
      }
    })
    .catch(function (error) {
      console.log(error)
    })
}

function wsAddCarImage(postData, globals) {
  // const globals = useGlobalStore();
  axios.post(globals.getWebServiceURL + 'base64Jpeg2File', postData)
    .then(function (response) {
      if (response.data.result) {
        let newPhoto = response.data.photo
        newPhoto.imageUrl = globals.getWebServiceURL + getImageAccessUrl(globals.car.current_number, newPhoto.url, globals.car.forDate)
        globals.car.photos.push(newPhoto)
        // wsGetCarImages(globals)
        // console.log(response.data.image)
        // globals.car.photos.push(response.data.image)
      } else {
        console.warn(response.data.message ? response.data.message : 'Error returns from server, check logs!')
      }
    })
    .catch(function (error) {
      console.log(error)
    })
}

function wsGetStreetCameraImage(cameraIp, globals) {
  const carNumber = globals.car.current_number,
    infoId = globals.car.infoCurrentId,
    forDate = globals.car.forDate,
    carState = globals.car.state

  if (!cameraIp || !carNumber || !infoId || !forDate || !carState) {
    response.status(400).send({ result: false, message: 'Parameters are not properly defined!' })
    return
  }

  console.log('Get street images for car:', carNumber)
  console.log(' ...  and from camera(ip):', cameraIp)
  console.log(' ...           and infoId:', infoId)
  console.log(' ...             for date:', forDate)
  console.log(' ...       and car number:', carState)
  const myPostData = {
    carNumber,
    forDate,
    carState,
    cameraIp,
    infoId
  }
  //TODO: Fix it
  axios.post(globals.getWebServiceURL + 'getStreetCameraImage', myPostData)
    .then(function (response) {
      if (response.data.result) {
        //        newPhoto.imageUrl = globals.getWebServiceURL + getImageAccessUrl(globals.car.current_number, newPhoto.url, globals.car.forDate)
        let newPhoto = response.data.photo
        newPhoto.imageUrl = globals.getWebServiceURL + getImageAccessUrl(carNumber, newPhoto.url, forDate)
        globals.car.photos.push(newPhoto)

        // let newPhoto = response.data.photo
        // const newPhoto = getImageAccessUrl(carNumber, response.data.imageUrl, forDate)
        // globals.car.photos.push(imageUrl)
        console.log('New image created:', newPhoto.uls, 'for car', carNumber);
      } else {
        alert(response.data.message)
      }
    })
    .catch(function (error) {
      console.log(error)
    })
}

function wsGetCarImages(globals) {
  if (!globals.car.current_number) {
    alert('Нет номера авто!')
    return
  }
  if (!globals.car.forDate) {
    alert('Не выбрана дата!')
    return
  }

  console.log('Get images for car:', globals.car.current_number)
  console.log(' ...    and infoId:', globals.car.infoCurrentId)
  console.log(' ...  and for date:', globals.car.forDate)
  // const myPostData = {
  //   carID: globals.car.current_number,
  //   forDate: globals.car.forDate
  // }
  globals.car.photos = [] // reset car images
  let wsUrl = "cars/" + globals.car.current_number + "/infos/" + globals.car.infoCurrentId + "/photos"
  // axios.post(globals.getWebServiceURL + 'getImages', myPostData)
  axios.post(globals.getWebServiceURL + wsUrl)
    .then(function (response) {
      if (response.data.result) {
        globals.car.photos = response.data.car.photos;
        globals.car.photos.forEach(element => {
          element.imageUrl = globals.getWebServiceURL + getImageAccessUrl(globals.car.current_number, element.url, globals.car.forDate)
        })
      }
    })
    .catch(function (error) {
      console.log(error)
    })
}

export {
  wsAddCarImage, wsGetCarImages, wsGetStreetCameraImage,
  wsLogin, wsCheckLogin, wsLogout, wsChangePassword,
  wsGetAllUsers, wsAddUser, wsUpdateUser, wsGetRoles, wsChangeRole4User,
  wsGetTransportTypes, wsGetCarInfosDates, wsGetCarInfos4Date
}
