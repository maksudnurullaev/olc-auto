import axios from 'axios';

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

function wsGetCarImages(globals) {
    if (!globals.car.carID) {
        alert('Нет номера авто!');
        return;
    }
    console.log("Get images for car:", globals.car.carID);
    console.log(" ... and  for date:", globals.car.forDate);
    let myPostData =  {
        carID: globals.car.carID,
        forDate: globals.car.forDate
    }
    axios.post(globals.getWebServiceURL + "getImages",myPostData)
        .then(function (response) {
            console.log(response.data.imagesUrls);
            // globals.car.images.push(response.data.image);
        })
        .catch(function (error) {
            console.log(error);
        });

}


export { wsAddCarImage, wsGetCarImages };