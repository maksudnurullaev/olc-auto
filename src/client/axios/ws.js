import axios from 'axios';
import { getImageAccessUrl } from '../../utils/common';

function wsAddCarImage(postData, globals) {
    // const globals = useGlobalStore();
    axios.post(globals.getWebServiceURL + "base64Jpeg2File", postData)
        .then(function (response) {
            console.log(response.data.image);
            globals.car.images.push(response.data.image);
        })
        .catch(function (error) {
            console.log(error);
        });
}

function wsGetCameraImage(cameraIp, globals){
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

export { wsAddCarImage, wsGetCarImages, wsGetCameraImage };