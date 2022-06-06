import axios from 'axios';
import { getImageAccessUrl } from '../../utils/common';

function wsGetRoles(globals, pageResources) {
    axios.post(globals.getWebServiceURL + "getRoles").then(function (response) {
        if (response.data.result) {
            pageResources.roles = response.data.roles;
            response.data.roles.forEach((role) => {
                pageResources.rolesMap[role.id] = role.description;
            })
        }
    });
}

function wsChangeRole4User(globals, postData) {
    axios.post(globals.getWebServiceURL + "changeRole4User", postData).then(function (response) {
        if (response.data.result) {
            console.log(response.data.message);
        }
    });
}

function wsGetAllUsers(globals, pageResources) {
    axios.post(globals.getWebServiceURL + "getAllUsers")
        .then(function (response) {
            if (response.data.result) {
                pageResources.users = response.data.users;
            } else {
                if (response.data.message) {
                    alert(response.data.message);
                } else {
                    console.warn("Get all users: error!");
                }
                return [];
            }
        })
        .catch(function (error) {
            console.log(error);
            return [];
        });
}

function wsLogout(globals) {
    axios.post(globals.getWebServiceURL + "logout")
        .then(function (response) {
            if (response.data.result) {
                globals.user = response.data.user;
            } else {
                if (response.data.message) {
                    alert(response.data.message);
                } else {
                    console.warn("Logout error!");
                }
            }
        })
        .catch(function (error) {
            console.log(error);
        });
}

function wsCheckLogin(globals) {
    axios.post(globals.getWebServiceURL + "checkLogin")
        .then(function (response) {
            if (response.data.result) {
                console.log(response.data.message);
                globals.user = response.data.user;
            } else {
                if (response.data.message) {
                    console.warn(response.data.message);
                }
            }
        })
        .catch(function (error) {
            console.log(error);
        });
}

function wsAddUser(userData, globals) {
    return axios.post(globals.getWebServiceURL + "addUser", userData);
}

function wsUpdateUser(userData, globals) {
    return axios.post(globals.getWebServiceURL + "updateUser", userData);
}


function wsChangePassword(userData, globals) {
    let postData = { userId: userData.userId, newUserPassword: userData.newUserPassword };
    return axios.post(globals.getWebServiceURL + "changePassword", postData);
}

function wsLogin(userData, globals) {
    let postData = {
        id: userData.id,
        password: userData.password
    };
    // console.log(postData);
    axios.post(globals.getWebServiceURL + "login", postData)
        .then(function (response) {
            if (response.data.result) {
                console.log(response.data.message);
                globals.user = response.data.user;
            } else {
                if (response.data.message) {
                    alert(response.data.message);
                } else {
                    console.warn("Authorization error!");
                }
            }
        })
        .catch(function (error) {
            console.log(error);
        });
}

function wsAddCarImage(postData, globals) {
    // const globals = useGlobalStore();
    axios.post(globals.getWebServiceURL + "base64Jpeg2File", postData)
        .then(function (response) {
            if (response.data.result) {
                console.log(response.data.image);
                globals.car.images.push(response.data.image);
            } else {
                console.warn(response.data.message ? response.data.message : "Error returns from server, check logs!");
            }
        })
        .catch(function (error) {
            console.log(error);
        });
}

function wsGetCameraImage(cameraIp, globals) {
    if (!globals.car.carID) {
        alert('Нет номера авто!');
        return;
    }
    console.log("Get images for car:", globals.car.carID);
    console.log(" ... and  from camera(ip):", cameraIp);
    console.log(" ... and  for date:", globals.car.forDate);
    let myPostData = {
        carID: globals.car.carID,
        forDate: globals.car.forDate,
        carState: globals.car.state,
        cameraIp: cameraIp
    }
    axios.post(globals.getWebServiceURL + "getCameraImage", myPostData)
        .then(function (response) {
            if (response.data.result) {
                let imageUrl = getImageAccessUrl(globals.car.carID, response.data.imageUrl, globals.car.forDate);
                globals.car.images.push(imageUrl);
                console.log("imageUrl:", imageUrl);
            } else {
                alert(response.data.message);
            }
        })
        .catch(function (error) {
            console.log(error);
        });
}

function wsGetCarImages(globals) {
    if (!globals.car.carID) {
        alert('Нет номера авто!');
        return;
    }
    console.log("Get images for car:", globals.car.carID);
    console.log(" ... and  for date:", globals.car.forDate);
    let myPostData = {
        carID: globals.car.carID,
        forDate: globals.car.forDate
    }
    globals.car.images = []; // reset car images
    axios.post(globals.getWebServiceURL + "getImages", myPostData)
        .then(function (response) {
            if (response.data.imageUrls.length) {
                response.data.imageUrls.forEach(element => {
                    let imageUrl = getImageAccessUrl(globals.car.carID, element, globals.car.forDate);
                    globals.car.images.push(imageUrl);
                    // console.log("imageUrl:", imageUrl);
                });
            }
            console.log("Found:", response.data.imageUrls.length, "images!");
        })
        .catch(function (error) {
            console.log(error);
        });

}

export {
    wsAddCarImage, wsGetCarImages, wsGetCameraImage,
    wsLogin, wsCheckLogin, wsLogout, wsChangePassword,
    wsGetAllUsers, wsAddUser, wsUpdateUser, wsGetRoles, wsChangeRole4User
};